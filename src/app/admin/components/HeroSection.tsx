"use client";
import { Metadata } from "next";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Overview } from "../components/overview";
import { RecentSales } from "../components/recent-sales";
import { UserRoles } from "@/constants/UserRoles";
import HeroMenu from "@/components/HeroMenu";
import Link from "next/link";
import { AspireDarkLogo } from "@/assets";
import DropDown from "./DropDown";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default function HeroSection() {
  const renderHeader = () => (
    <header className="flex justify-between items-center absolute w-full top-0 h-20 md:h-32 px-5 lg:px-12 z-20">
      <div className="flex-1">
        <HeroMenu role={UserRoles.ADMIN} />
      </div>
      <Link href="/" scroll={false}>
        <Image
          src={AspireDarkLogo}
          alt="Aspire Clinix"
          width={80}
          height={88}
          className="zoom-out flex items-center justify-center w-[80px] h-[40px] md:w-[189px] md:h-[88px]"
        />
      </Link>
      <div className="zoom-out flex-1 flex gap-10 justify-end">
        <DropDown />
      </div>
    </header>
  );
  return (
    <>
      <div className="flex flex-col ">
        {renderHeader()}
        <div className="flex flex-col h-full gap-5 md:gap-12 mt-20 md:mt-32 px-6 md:px-12">
          <div className="w-1/4 flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="flex-1">
            <TabsList className="bg-[#423C36]">
              <TabsTrigger value="overview" className="text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-white" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-white" disabled>
                Reports
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 flex-1">
                <Card className="border border-[#ECE8E3]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                      Total Booked Treatments
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-xl">3459 Treatments </p>
                  </CardContent>

                  <CardFooter>
                    <p>265 treatments last month</p>
                  </CardFooter>
                </Card>

                <Card className="border border-[#ECE8E3]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                      Total Booked Appointment
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-xl">3459 Appointments </p>
                  </CardContent>

                  <CardFooter>
                    <p>400 appointments last month</p>
                  </CardFooter>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 flex-1">
                <Card className="col-span-4 border border-[#ECE8E3]">
                  <CardHeader>
                    <CardTitle>Registered Users</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3 border border-[#ECE8E3]">
                  <CardHeader>
                    <CardTitle>Top Paid Treatments</CardTitle>
                    <CardDescription>
                      You made 265 treatments this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
