"use client";

import { useState } from "react";
import Menu from "./Menu";

export default function HeroMenu() {
  const [menuStatus, setMenuStatus] = useState(false);
  return (
    <>
      <button
        className="font-gillSans"
        onClick={() => {
          setMenuStatus(true);
        }}
      >
        MENU
      </button>
      <Menu menuStatus={menuStatus} setMenuStatus={setMenuStatus} />
    </>
  );
}
