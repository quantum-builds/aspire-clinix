"use client";
import HeroSection from "./components/HeroSection";
import UserManagementSection from "./components/UserManagementSection";

export default function Admin() {
  return (
    <div className="bg-feeguidedark">
      <HeroSection />
      <UserManagementSection />
    </div>
  );
}
