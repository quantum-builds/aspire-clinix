// "use client";
// import { fetchAppointments } from "@/services/AppointmentService";
// import { getToken } from "next-auth/jwt";
// import { useSession } from "next-auth/react";
// import { cookies } from "next/headers";
// import Image, { StaticImageData } from "next/image";
// import Link from "next/link";

// // interface AppointmentCardProps {
// //   dateTime: string;
// //   servie: string;
// //   dentist: string;
// //   status: string;
// //   actions: Array<string>;
// // }

// // export default function AppointmentCard() {
// //   return;
// // }

// import React, { useEffect, useState } from "react";

// // interface Appointment {
// //   date: string;
// //   time: string;
// //   service: string;
// //   dentist: string;
// //   status: string;
// //   actions: string[];
// // }

// // interface PastAppointment {
// //   date: string;
// //   service: string;
// //   dentist: string;
// //   status: string;
// //   report: string;
// // }

// interface Appointment {
//   id: string;
//   dentistId: string;
//   appointmentDate: string;
//   appointmentStatus: string | null;
//   service: string;
//   downloadReport: string | null;
//   patientId: string;
//   dentist: {
//     id: string;
//     name: string;
//   };
//   patient: {
//     id: string;
//     name: string;
//   };
// }

// interface PastAppointment {
//   date: string;
//   service: string;
//   dentist: string;
//   status: string;
//   report: string;
// }

// export default function AppointmentView() {
//   // Example data
//   // const nextAppointment: Appointment = {
//   //   date: "January 20, 2025",
//   //   time: "10:30 AM",
//   //   service: "Dental Checkup",
//   //   dentist: "Dr. Smith",
//   //   status: "Confirmed",
//   //   actions: ["Modify", "Cancel", "Reschedule"],
//   // };

//   // const upcomingAppointments: Appointment[] = [
//   //   {
//   //     date: "Jan 22, 2025",
//   //     time: "11:00 AM",
//   //     service: "Root Canal",
//   //     dentist: "Dr. Allen",
//   //     status: "Confirmed",
//   //     actions: ["Modify", "Cancel"],
//   //   },
//   //   {
//   //     date: "Jan 25, 2025",
//   //     time: "2:00 PM",
//   //     service: "Hygiene Cleaning",
//   //     dentist: "Dr. Brown",
//   //     status: "Pending",
//   //     actions: ["Modify"],
//   //   },
//   //   {
//   //     date: "Jan 30, 2025",
//   //     time: "9:00 AM",
//   //     service: "Teeth Whitening",
//   //     dentist: "Dr. Allen",
//   //     status: "Confirmed",
//   //     actions: ["Modify", "Cancel"],
//   //   },
//   // ];

//   // const pastAppointments: { month: string; appointments: PastAppointment[] }[] =
//   //   [
//   //     {
//   //       month: "January 2025",
//   //       appointments: [
//   //         {
//   //           date: "Jan 15, 2025",
//   //           service: "Teeth Cleaning",
//   //           dentist: "Dr. Brown",
//   //           status: "Completed",
//   //           report: "Download Report",
//   //         },
//   //         {
//   //           date: "Jan 10, 2025",
//   //           service: "Consultation",
//   //           dentist: "Dr. Smith",
//   //           status: "Completed",
//   //           report: "Download Report",
//   //         },
//   //       ],
//   //     },
//   //     {
//   //       month: "December 2024",
//   //       appointments: [
//   //         {
//   //           date: "Dec 20, 2024",
//   //           service: "Emergency Visit",
//   //           dentist: "Dr. Allen",
//   //           status: "Completed",
//   //           report: "Download Report",
//   //         },
//   //         {
//   //           date: "Dec 15, 2024",
//   //           service: "Root Canal",
//   //           dentist: "Dr. Brown",
//   //           status: "Completed",
//   //           report: "Download Report",
//   //         },
//   //       ],
//   //     },
//   //   ];

//   // const [appointments, setAppointments] = useState([]);
//   // const [error, setError] = useState<string | null>(null);
//   // // const { data: session, status } = useSession();

//   // useEffect(() => {
//   //   const loadAppointments = async () => {
//   //     // if (!session) {
//   //     //   setError("You need to log in first.");
//   //     //   return;
//   //     // }

//   //     try {
//   //       const data = await fetchAppointments();
//   //       console.log(data);
//   //       setAppointments(data);
//   //     } catch (error) {
//   //       setError("Error loading appointments");
//   //     }
//   //   };

//   //   loadAppointments();
//   // }, []);

//   // if (status === "loading") {
//   //   return <div>Loading...</div>;
//   // }

//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [nextAppointment, setNextAppointment] = useState<Appointment | null>(
//     null
//   );
//   const [upcomingAppointments, setUpcomingAppointments] = useState<
//     Appointment[]
//   >([]);
//   const [pastAppointments, setPastAppointments] = useState<PastAppointment[]>(
//     []
//   );
//   const [error, setError] = useState<string | null>(null);

//   // useEffect(() => {
//   //   console.log("next ", nextAppointment);
//   //   console.log("upcoming ", upcomingAppointments);
//   //   console.log("past ", pastAppointments);
//   // }, [upcomingAppointments, nextAppointment, pastAppointments]);

//   useEffect(() => {
//     const loadAppointments = async () => {
//       try {
//         const data = await fetchAppointments();
//         // console.log(data);
//         setAppointments(data);
//         classifyAppointments(data);
//       } catch (error) {
//         setError("Error loading appointments");
//       }
//     };

//     const classifyAppointments = (data: Appointment[]) => {
//       const today = new Date();
//       let next: Appointment | null = null;
//       const upcoming: Appointment[] = [];
//       const past: PastAppointment[] = [];

//       // Process the appointments to classify them into next, upcoming, and past
//       data.forEach((appointment) => {
//         const appointmentDate = new Date(appointment.appointmentDate);
//         // console.log("appoint time ", appointmentDate);
//         // console.log("current time " , today);

//         if (appointmentDate > today) {
//           // console.log("duedeude");
//           if (!next) {
//             // console.log("in next");
//             next = appointment;
//             // First upcoming appointment as the next appointment
//           } else {
//             console.log(appointment);
//             upcoming.push(appointment);
//           }
//         } else {
//           past.push({
//             date: appointment.appointmentDate,
//             service: appointment.service,
//             dentist: appointment.dentist.name,
//             status: appointment.appointmentStatus || "Completed",
//             report: appointment.downloadReport || "No Report Available",
//           });
//         }
//       });

//       // console.log(data);

//       console.log(past);
//       setNextAppointment(next);
//       setUpcomingAppointments(upcoming);
//       setPastAppointments(past);
//     };

//     loadAppointments();
//   }, []);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="p-5 lg:p-12 font-opus bg-feeGuide">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">My Appointments</h1>
//         <div className="flex gap-4">
//           <button className="bg-[#C9BCA9] text-white px-4 py-2 rounded">
//             + Book New Appointment
//           </button>
//           <button className="bg-[#C9BCA9] px-4 py-2 rounded">
//             View History
//           </button>
//         </div>
//       </div>

//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4">Next Appointment</h2>
//         <div className="p-4shadow-md rounded-md">
//           <p>
//             <strong>Date & Time:</strong> {nextAppointment?.appointmentDate}
//           </p>
//           <p>
//             <strong>Service:</strong> {nextAppointment?.service}
//           </p>
//           <p>
//             <strong>Dentist:</strong> {nextAppointment?.dentist.name}
//           </p>
//           <p>
//             <strong>Status:</strong>{" "}
//             <span className="text-green-500">
//               {nextAppointment?.appointmentStatus}
//             </span>
//           </p>
//           <div className="flex gap-4 mt-4">
//             {/* {nextAppointment.actions.map((action, index) => (
//               <button
//                 key={index}
//                 className="bg-[#C9BCA9] text-white px-4 py-2 rounded"
//               >
//                 {action}
//               </button>
//             ))} */}
//           </div>
//         </div>
//       </div>

//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
//         <div className="overflow-x-auto">
//           <table className="table-auto w-full  shadow-md rounded-md">
//             <thead className="bg-[#C9BCA9]">
//               <tr>
//                 <th className="px-4 py-2">Date & Time</th>
//                 <th className="px-4 py-2">Service</th>
//                 <th className="px-4 py-2">Dentist</th>
//                 <th className="px-4 py-2">Status</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="">
//               {upcomingAppointments.map((appointment, index) => (
//                 <tr key={index}>
//                   <td className="px-4 py-2">{appointment.appointmentDate}</td>
//                   <td className="px-4 py-2">{appointment.service}</td>
//                   <td className="px-4 py-2">{appointment.dentist.name}</td>
//                   <td className="px-4 py-2">
//                     <span
//                       className={`${
//                         appointment.appointmentStatus === "Confirmed"
//                           ? "text-green-500"
//                           : "text-yellow-500"
//                       }`}
//                     >
//                       {appointment.appointmentStatus}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2">
//                     <button className="bg-[#C9BCA9] text-white px-4 py-2 rounded mr-2">
//                       Modify
//                     </button>
//                     <button className="bg-[#C9BCA9] text-white px-4 py-2 rounded mr-2">
//                       Cancel
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="">
//         <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
//         {/* {pastAppointments.map((group, index) => (
//           <div key={index} className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">+ {group.}</h3>
//             <ul>
//               {group.appointments.map((appointment, idx) => (
//                 <li
//                   key={idx}
//                   className="flex justify-between items-center p-4 bg-white shadow-md rounded-md mb-2"
//                 >
//                   <div>
//                     <p>
//                       <strong>{appointment.date}</strong> -{" "}
//                       {appointment.service}
//                     </p>
//                     <p>Dentist: {appointment.dentist}</p>
//                   </div>
//                   <div>
//                     <button className=" underline">{appointment.report}</button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))} */}
//       </div>
//     </div>
//   );
// }
