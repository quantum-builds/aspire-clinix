import { constants } from "crypto";

const TEAM_SECTION_DATA = [
  {
    buttonText: "Read Bio",
    member_name: "Dr. Richard Porter",
  },
  {
    buttonText: "Read Bio",
    member_name: "Dr. Raheel Malik",
  },
  {
    buttonText: "Read Bio",
    member_name: "Dr. Raheel Malik",
  },
];
export default function TeamSection() {
  return (
    <div className="flex flex-col justify-center">
      <p>Meet the team</p>
    </div>
  );
}
