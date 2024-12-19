"use client";
interface HeroMenuProps {
  backgroundColor?: string;
}

import { useState } from "react";
import Menu from "./Menu";

export default function HeroMenu({ backgroundColor }: HeroMenuProps) {
  const [menuStatus, setMenuStatus] = useState(false);
  return (
    <>
      <button
        className="font-gillSans"
        onClick={() => {
          setMenuStatus(true);
        }}
        style={{ color: `${backgroundColor}` }}
      >
        MENU
      </button>
      <Menu menuStatus={menuStatus} setMenuStatus={setMenuStatus} />
    </>
  );
}
