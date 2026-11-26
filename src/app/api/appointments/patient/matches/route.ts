import { TokenRoles } from "@/constants/UserRoles";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getAllActivePatients } from "@/dentallyHelpers/patient";
import prisma from "@/lib/db";
import {
  MAX_NAME_MATCHES,
  NAME_MATCH_THRESHOLD,
  normalizeName,
  scoreCandidate,
  NameMatch,
} from "@/utils/patientNameMatch";

export interface SimilarPatient {
  dentallyPatientId: number;
  name: string;
  match: NameMatch;
  score: number;
}


export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const { searchParams } = new URL(req.url);
    const referralRequestId = searchParams.get("referralRequestId");
    let searchName = searchParams.get("patientName")?.trim() || "";

    if (!searchName && referralRequestId) {
      const referral = await prisma.referralRequest.findUnique({
        where: { id: referralRequestId },
        select: { referralForm: { select: { patientName: true } } },
      });

      if (!referral) {
        return NextResponse.json(
          createResponse(false, "Referral not found", null),
          { status: 404 },
        );
      }

      searchName = referral.referralForm.patientName;
    }

    const searchWords = normalizeName(searchName);

    if (searchWords.length === 0) {
      return NextResponse.json(
        createResponse(false, "Patient name is required", null),
        { status: 400 },
      );
    }

    // Dentally's own search only matches names that start with the query, so
    // spelling variants ("Mahammad" vs "Muhammad") are missed. Instead we
    // fuzzy-match against every active patient.
    const allPatients = await getAllActivePatients();

    const scored: SimilarPatient[] = allPatients
      .map((patient) => {
        const name = [patient.firstName, patient.middleName, patient.lastName]
          .filter(Boolean)
          .join(" ")
          .trim();
        const { score, match } = scoreCandidate(
          searchWords,
          normalizeName(name),
        );

        return {
          dentallyPatientId: Number(patient.id),
          name,
          match,
          score: Math.round(score * 100) / 100,
        };
      })
      .sort((a, b) => b.score - a.score);

    const aboveThreshold = scored.filter(
      (patient) => patient.score >= NAME_MATCH_THRESHOLD,
    );
    const topPatients = aboveThreshold.slice(0, MAX_NAME_MATCHES);

    // Debug: match settings and the top scores.
    console.log("[SIMILAR-PATIENTS] settings", {
      searchName,
      searchWords,
      threshold: NAME_MATCH_THRESHOLD,
      maxMatches: MAX_NAME_MATCHES,
      totalPatients: allPatients.length,
    });
    console.table(
      scored.slice(0, 20).map((patient) => ({
        id: patient.dentallyPatientId,
        name: patient.name,
        match: patient.match,
        score: patient.score,
        threshold: NAME_MATCH_THRESHOLD,
        kept: patient.score >= NAME_MATCH_THRESHOLD,
      })),
    );
    console.log(
      `[SIMILAR-PATIENTS] ${topPatients.length} shown in the modal ` +
        `(${aboveThreshold.length} above threshold, max ${MAX_NAME_MATCHES})`,
    );

    return NextResponse.json(
      createResponse(
        true,
        topPatients.length > 0
          ? "Similar patients found"
          : "No similar patient found in Dentally",
        { searchName, patients: topPatients },
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error finding similar patients:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Failed to find patients",
        null,
      ),
      { status: 500 },
    );
  }
}
