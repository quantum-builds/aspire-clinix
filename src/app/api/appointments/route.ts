import { createAppointment } from "@/dentallyHelpers/appointment";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const appointment = await req.json();
        const createAppointmentResponse = await createAppointment(appointment)
        if (createAppointmentResponse.isError) {
            return createAppointmentResponse.response
        }
        const newAppointment = createAppointmentResponse.response
        return NextResponse.json(
            createResponse(true, "Appointment Booked Successfully", newAppointment),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error fetching appointments", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(createResponse(false, errorMessage, null), {
            status: 500,
        });
    }
}