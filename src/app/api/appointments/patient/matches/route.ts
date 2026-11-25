import { TokenRoles } from "@/constants/UserRoles";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { searchAllPatients } from "@/dentallyHelpers/patient";
import prisma from "@/lib/db";
import {
  MAX_NAME_MATCHES,
  NAME_MATCH_THRESHOLD,
  normalizeName,
  scoreCandidate,
  NameMatch,
} from "@/utils/patientNameMatch";

const SEARCH_PREFIX_LENGTH = 3;

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

    const queries = Array.from(
      new Set([
        searchWords.join(" "),
        ...searchWords,
        ...searchWords
          .filter((word) => word.length > SEARCH_PREFIX_LENGTH)
          .map((word) => word.slice(0, SEARCH_PREFIX_LENGTH)),
      ]),
    );

    const results = await Promise.all(
      queries.map((query) => searchAllPatients(query)),
    );

    if (results.every((result) => result.isError)) {
      return NextResponse.json(
        createResponse(false, "Failed to fetch patients from Dentally", null),
        { status: 500 },
      );
    }

    const candidates = new Map<number, any>();

    for (const result of results) {
      if (result.isError) continue;

      for (const patient of result.response.patients ?? []) {
        if (!patient.active || patient.archivedReason) continue;
        candidates.set(Number(patient.id), patient);
      }
    }

    const scored: SimilarPatient[] = Array.from(candidates.values())
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

    const topPatients = scored
      .filter((patient) => patient.score >= NAME_MATCH_THRESHOLD)
      .slice(0, MAX_NAME_MATCHES);

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
