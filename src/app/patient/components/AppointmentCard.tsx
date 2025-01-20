import Image, { StaticImageData } from "next/image";
import Link from "next/link";

// interface AppointmentCardProps {
//   dateTime: string;
//   servie: string;
//   dentist: string;
//   status: string;
//   actions: Array<string>;
// }

// export default function AppointmentCard() {
//   return;
// }

import React from "react";

interface Appointment {
  date: string;
  time: string;
  service: string;
  practitioner: string;
  status: string;
  actions: string[];
}

interface PastAppointment {
  date: string;
  service: string;
  practitioner: string;
  status: string;
  report: string;
}

const AppointmentsView: React.FC = () => {
  // Example data
  const nextAppointment: Appointment = {
    date: "January 20, 2025",
    time: "10:30 AM",
    service: "Dental Checkup",
    practitioner: "Dr. Smith",
    status: "Confirmed",
    actions: ["Modify", "Cancel", "Reschedule"],
  };

  const upcomingAppointments: Appointment[] = [
    {
      date: "Jan 22, 2025",
      time: "11:00 AM",
      service: "Root Canal",
      practitioner: "Dr. Allen",
      status: "Confirmed",
      actions: ["Modify", "Cancel"],
    },
    {
      date: "Jan 25, 2025",
      time: "2:00 PM",
      service: "Hygiene Cleaning",
      practitioner: "Dr. Brown",
      status: "Pending",
      actions: ["Modify"],
    },
    {
      date: "Jan 30, 2025",
      time: "9:00 AM",
      service: "Teeth Whitening",
      practitioner: "Dr. Allen",
      status: "Confirmed",
      actions: ["Modify", "Cancel"],
    },
  ];

  const pastAppointments: { month: string; appointments: PastAppointment[] }[] =
    [
      {
        month: "January 2025",
        appointments: [
          {
            date: "Jan 15, 2025",
            service: "Teeth Cleaning",
            practitioner: "Dr. Brown",
            status: "Completed",
            report: "Download Report",
          },
          {
            date: "Jan 10, 2025",
            service: "Consultation",
            practitioner: "Dr. Smith",
            status: "Completed",
            report: "Download Report",
          },
        ],
      },
      {
        month: "December 2024",
        appointments: [
          {
            date: "Dec 20, 2024",
            service: "Emergency Visit",
            practitioner: "Dr. Allen",
            status: "Completed",
            report: "Download Report",
          },
          {
            date: "Dec 15, 2024",
            service: "Root Canal",
            practitioner: "Dr. Brown",
            status: "Completed",
            report: "Download Report",
          },
        ],
      },
    ];

  return (
    <div className="p-5 lg:p-12 font-opus bg-feeGuide">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Appointments</h1>
        <div className="flex gap-4">
          <button className="bg-[#C9BCA9] text-white px-4 py-2 rounded">
            + Book New Appointment
          </button>
          <button className="bg-[#C9BCA9] px-4 py-2 rounded">
            View History
          </button>
        </div>
      </div>

      {/* Next Appointment */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Next Appointment</h2>
        <div className="p-4shadow-md rounded-md">
          <p>
            <strong>Date & Time:</strong> {nextAppointment.date},{" "}
            {nextAppointment.time}
          </p>
          <p>
            <strong>Service:</strong> {nextAppointment.service}
          </p>
          <p>
            <strong>Practitioner:</strong> {nextAppointment.practitioner}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-500">{nextAppointment.status}</span>
          </p>
          <div className="flex gap-4 mt-4">
            {nextAppointment.actions.map((action, index) => (
              <button
                key={index}
                className="bg-[#C9BCA9] text-white px-4 py-2 rounded"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full  shadow-md rounded-md">
            <thead className="bg-[#C9BCA9]">
              <tr>
                <th className="px-4 py-2">Date & Time</th>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Practitioner</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments.map((appointment, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    {appointment.date}, {appointment.time}
                  </td>
                  <td className="px-4 py-2">{appointment.service}</td>
                  <td className="px-4 py-2">{appointment.practitioner}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`${
                        appointment.status === "Confirmed"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {appointment.actions.map((action, idx) => (
                      <button
                        key={idx}
                        className="bg-[#C9BCA9] text-white px-4 py-2 rounded mr-2"
                      >
                        {action}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Past Appointments */}
      <div className="">
        <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
        {pastAppointments.map((group, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">+ {group.month}</h3>
            <ul>
              {group.appointments.map((appointment, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center p-4 bg-white shadow-md rounded-md mb-2"
                >
                  <div>
                    <p>
                      <strong>{appointment.date}</strong> -{" "}
                      {appointment.service}
                    </p>
                    <p>Practitioner: {appointment.practitioner}</p>
                  </div>
                  <div>
                    <button className=" underline">{appointment.report}</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsView;
