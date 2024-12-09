import { constants } from "crypto";

const TEAM_SECTION_DATA = [
  {
    
    button_text: "Read Bio",
    member_name: "Dr. Richard Porter",
  },
  {
    button_text: "Read Bio",
    member_name: "Dr. Raheel Malik",
  },
  {
    button_text: "Read Bio",
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
