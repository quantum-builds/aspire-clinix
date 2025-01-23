import { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DownIcon, UpIcon } from "../../../assets";

const dentistSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  gdcNumber: z.string().min(1, "GDC Number is required"),
  mobilePhone: z.string().regex(/^\d{10}$/, "Mobile phone must be 10 digits"),
});

const UserManagementSection = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dr. John Doe",
      email: "john.doe@example.com",
      type: "Dentist",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      type: "Patient",
    },
    {
      id: 3,
      name: "Dr. Emma Brown",
      email: "emma.brown@example.com",
      type: "Dentist",
    },
    {
      id: 4,
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      type: "Patient",
    },
    {
      id: 5,
      name: "Dr. Sarah Davis",
      email: "sarah.davis@example.com",
      type: "Dentist",
    },
    {
      id: 6,
      name: "Laura Wilson",
      email: "laura.wilson@example.com",
      type: "Patient",
    },
    {
      id: 7,
      name: "Dr. William Martinez",
      email: "william.martinez@example.com",
      type: "Dentist",
    },
    {
      id: 8,
      name: "Emily Taylor",
      email: "emily.taylor@example.com",
      type: "Patient",
    },
    {
      id: 9,
      name: "Dr. Christopher Moore",
      email: "christopher.moore@example.com",
      type: "Dentist",
    },
    {
      id: 10,
      name: "Sophia Thomas",
      email: "sophia.thomas@example.com",
      type: "Patient",
    },
    {
      id: 11,
      name: "Dr. Daniel Harris",
      email: "daniel.harris@example.com",
      type: "Dentist",
    },
    {
      id: 12,
      name: "Isabella Clark",
      email: "isabella.clark@example.com",
      type: "Patient",
    },
    {
      id: 13,
      name: "Dr. Matthew Lewis",
      email: "matthew.lewis@example.com",
      type: "Dentist",
    },
    {
      id: 14,
      name: "Mason Walker",
      email: "mason.walker@example.com",
      type: "Patient",
    },
    {
      id: 15,
      name: "Dr. Olivia Hall",
      email: "olivia.hall@example.com",
      type: "Dentist",
    },
    {
      id: 16,
      name: "Liam Scott",
      email: "liam.scott@example.com",
      type: "Patient",
    },
    {
      id: 17,
      name: "Dr. Benjamin Allen",
      email: "benjamin.allen@example.com",
      type: "Dentist",
    },
    {
      id: 18,
      name: "Amelia Young",
      email: "amelia.young@example.com",
      type: "Patient",
    },
    {
      id: 19,
      name: "Dr. Lucas King",
      email: "lucas.king@example.com",
      type: "Dentist",
    },
    {
      id: 20,
      name: "Charlotte Wright",
      email: "charlotte.wright@example.com",
      type: "Patient",
    },
    {
      id: 21,
      name: "Dr. Alexander Baker",
      email: "alexander.baker@example.com",
      type: "Dentist",
    },
    {
      id: 22,
      name: "Harper Lee",
      email: "harper.lee@example.com",
      type: "Patient",
    },
    {
      id: 23,
      name: "Dr. Ella Adams",
      email: "ella.adams@example.com",
      type: "Dentist",
    },
    {
      id: 24,
      name: "Ethan Perez",
      email: "ethan.perez@example.com",
      type: "Patient",
    },
    {
      id: 25,
      name: "Dr. Abigail Campbell",
      email: "abigail.campbell@example.com",
      type: "Dentist",
    },
    {
      id: 26,
      name: "Jack Rivera",
      email: "jack.rivera@example.com",
      type: "Patient",
    },
    {
      id: 27,
      name: "Dr. Lily Torres",
      email: "lily.torres@example.com",
      type: "Dentist",
    },
    {
      id: 28,
      name: "Mila Howard",
      email: "mila.howard@example.com",
      type: "Patient",
    },
    {
      id: 29,
      name: "Dr. Noah Brooks",
      email: "noah.brooks@example.com",
      type: "Dentist",
    },
    {
      id: 30,
      name: "Avery Gray",
      email: "avery.gray@example.com",
      type: "Patient",
    },
  ]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gdcNumber: "",
    mobilePhone: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = dentistSchema.safeParse(formData);

    if (!result.success) {
      // Display validation errors
      result.error.errors.forEach((error) => {
        toast.error(error.message);
      });
      return;
    }

    // Show success toast
    toast.success("Email sent successfully!");

    // Clear the form
    setFormData({
      fullName: "",
      email: "",
      gdcNumber: "",
      mobilePhone: "",
    });
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
    toast.success("User deleted successfully!");
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("All");

  const options = ["All", "Dentist", "Patient"];

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesType = selectedValue === "All" || user.type === selectedValue;
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col xl:h-screen xl:flex-row gap-4 xl:gap-0  p-12">
      <div className="w-full xl:w-1/2 xl:p-4 p-1 ">
        <h2 className="text-3xl font-bold mb-4">Users List</h2>
        <div className="flex items-center mb-4 rounded-md">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 bg-[#ECE8E3] border border-gray-300 rounded-md w-1/2 mr-4"
          />
          <div className="relative w-48">
            <div
              className="flex justify-between items-center p-2 bg-[#ECE8E3] border border-gray-300 rounded text-gray-700 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <button className="w-full text-left ">{selectedValue}</button>
              <Image
                src={isOpen === true ? UpIcon : DownIcon}
                alt="Dropdown Icon"
                width={30}
                height={30}
                className="zoom-out flex items-center justify-center"
              />
            </div>
            {isOpen && (
              <ul className="absolute left-0 w-full bg-[#ECE8E3] border border-gray-300 rounded mt-1 z-10">
                {options.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(option)}
                    className="p-2 hover:bg-[#423C36] hover:text-white cursor-pointer"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Add max-height and overflow-y-auto to this container */}
        <div className="overflow-y-auto max-h-[70vh] ">
          <table className="min-w-full rounded-lg">
            <thead className="border-2 border-[#423C36]">
              <tr className="bg-[#423C36] text-white">
                <th className="p-2 border-b border-[#423C36]">ID</th>
                <th className="p-2 border-b border-[#423C36]">Name</th>
                <th className="p-2 border-b border-[#423C36]">Email</th>
                <th className="p-2 border-b border-[#423C36]">Type</th>
                <th className="p-2 border-b border-[#423C36]">Actions</th>
              </tr>
            </thead>
            <tbody className="border-2 border-[#423C36]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-center border border-white">
                  <td className="p-2 border-b border-[#423C36]">{user.id}</td>
                  <td className="p-2 border-b border-[#423C36]">{user.name}</td>
                  <td className="p-2 border-b border-[#423C36]">
                    {user.email}
                  </td>
                  <td className="p-2 border-b border-[#423C36]">{user.type}</td>
                  <td className="p-2 border-b border-[#423C36]">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full xl:w-1/2 xl:p-8 p-2">
        <h2 className="text-3xl font-bold mb-4">Add Dentist</h2>
        <form
          onSubmit={handleFormSubmit}
          className="space-y-4 flex flex-col items-center gap-4"
        >
          <div className="xl:w-1/2 w-3/4">
            <label className="block text-lg font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 h-14 text-base bg-[#ECE8E3] border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="xl:w-1/2 w-3/4">
            <label className="block text-lg font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 h-14 text-base bg-[#ECE8E3] border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="xl:w-1/2 w-3/4">
            <label className="block text-lg font-medium mb-1">GDC Number</label>
            <input
              type="text"
              name="gdcNumber"
              value={formData.gdcNumber}
              onChange={handleInputChange}
              className="w-full p-2 h-14 text-base bg-[#ECE8E3] border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="xl:w-1/2 w-3/4">
            <label className="block text-lg font-medium mb-1">
              Mobile Phone
            </label>
            <input
              type="text"
              name="mobilePhone"
              value={formData.mobilePhone}
              onChange={handleInputChange}
              className="w-full p-2 h-14 text-base bg-[#ECE8E3] border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="xl:w-1/2 w-3/4 bg-[#423C36] text-white p-2 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UserManagementSection;
