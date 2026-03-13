import { TokenRoles } from "@/constants/UserRoles";
import { createAppointment } from "@/dentallyHelpers/appointment";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { AppointmentDateType } from "@/types/common";
import { listAppointment } from "@/dentallyHelpers/appointment";
import {
  Appointment,
  AppointmentState,
  ListAppointment,
} from "@/types/appointment";

export async function POST(req: NextRequest) {
  try {
    const appointment = await req.json();
    const createAppointmentResponse = await createAppointment(appointment);
    if (createAppointmentResponse.isError) {
      return createAppointmentResponse.response;
    }
    const newAppointment = createAppointmentResponse.response;
    return NextResponse.json(
      createResponse(true, "Appointment Booked Successfully", newAppointment),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error fetching appointments", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
    });

    if (token && token.role === TokenRoles.REFERRING_DENTIST) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 403,
      });
    }
    let patiendId = "";
    let dentistId = "";
    if (token && token.role === TokenRoles.PATIENT) {
      patiendId = token.sub || "";
    } else if (
      token &&
      (token.role == TokenRoles.DENTIST ||
        token.role === TokenRoles.RECIEVING_DENTIST)
    ) {
      dentistId = token.sub || "";
    }

    const { searchParams } = new URL(req.url);
    const on = searchParams.get("on") || "";
    const before = searchParams.get("before") || "";
    const after = searchParams.get("after") || "";
    const updatedAfter = searchParams.get("updated_after") || "";
    const practitionerId = searchParams.get("practitioner_id") || "";
    const siteId = searchParams.get("site_id") || "";
    const state = searchParams.get("state") || "";

    const appointmentParams: ListAppointment = {
      on: on ? new Date(on) : undefined,
      before: before ? new Date(before) : undefined,
      after: after ? new Date(after) : undefined,
      updatedAfter: updatedAfter ? new Date(updatedAfter) : undefined,
      practitionerId: practitionerId || undefined,
      siteId: siteId || undefined,
      state: state ? (state as AppointmentState) : undefined,
    };
    const response = await listAppointment(appointmentParams);
    if (response.isError)
        return response.response
    
    let appointments: Appointment[] = [];
    appointments = response.response as Appointment[];

    return NextResponse.json(
      createResponse(true, "Appointments fetched successfully", appointments),{status:200},
    );

    // const page = parseInt(searchParams.get("page") || "1", 10);

    // const search = searchParams.get("search") || "";
    // const statusParam = searchParams.get("status") || "";
  } catch (error) {
    console.error("Error fetching appointments", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
