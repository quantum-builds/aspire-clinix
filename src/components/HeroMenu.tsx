"use client";
interface HeroMenuProps {
  backgroundColor?: string;
  role?: string;
}

import { useState } from "react";
import Menu from "./Menu";
import { UserRoles } from "@/constants/UserRoles";

export default function HeroMenu({
  backgroundColor,
  role = UserRoles.PATIENT,
}: HeroMenuProps) {
  const [menuStatus, setMenuStatus] = useState(false);
  return (
    <>
      <button
        className="font-gillSans w-[73px] h-[27px] text-[17px] md:text-[24px]"
        onClick={() => {
          setMenuStatus(true);
        }}
        style={{ color: `${backgroundColor}` }}
      >
        <p className="zoom-out text-white">MENU</p>
      </button>
      <Menu menuStatus={menuStatus} setMenuStatus={setMenuStatus} role={role} />
    </>
  );
}
