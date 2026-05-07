"use client";

import { useMemo, useState } from "react";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";
import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import Dropdown from "@/app/(dashboards)/components/custom-components/DropDown";
import { TReport } from "@/types/reports";
import { Patient } from "@/types/patient";
import { Dentist } from "@/types/dentist";

interface Props {
  pdfs?: TReport[];
  videos?: TReport[];
  patient?: Patient | null;
  dentist?: Dentist | undefined;
}

export default function ClientReportGrid({
  pdfs = [],
  videos = [],
  patient,
  dentist,
}: Props) {
  const [selected, setSelected] = useState<string | null>("patient");

  const options = [
    { value: "patient", label: "Patient" },
    { value: "referral-dentist", label: "Referral Dentist" },
  ];

  const filteredPdfs = useMemo(() => {
    if (!selected) return pdfs;
    if (selected === "patient")
      return pdfs.filter((r) => r.patient?.id === patient?.id);
    if (selected === "referral-dentist")
      return pdfs.filter((r) => r.dentist?.id === dentist?.id);
    return pdfs;
  }, [selected, pdfs, patient, dentist]);

  const filteredVideos = useMemo(() => {
    if (!selected) return videos;
    if (selected === "patient")
      return videos.filter((r) => r.patient?.id === patient?.id);
    if (selected === "referral-dentist")
      return videos.filter((r) => r.dentist?.id === dentist?.id);
    return videos;
  }, [selected, videos, patient, dentist]);

  return (
    <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div />
        <div className="flex items-center">
          <Dropdown
            options={options}
            value={selected ?? "patient"}
            onValueChange={(v) => setSelected(v)}
            placeholder="Patient"
            triggerClassName="px-4 py-2 rounded-full border border-gray-300 bg-white flex items-center gap-2"
            placeholderClassName="text-base text-green"
            contentClassName="bg-white border border-green rounded-lg shadow-lg"
            className="relative w-[210px]"
            emptyText="No options"
            showClearOption={false}
          />
        </div>
      </div>

      {filteredVideos.length === 0 && filteredPdfs.length === 0 ? (
        <p className="text-center italic">
          No reports found for selected filter.
        </p>
      ) : (
        <>
          <VideoReportGrid reports={filteredVideos ?? []} />
          <LetterReportGrid reports={filteredPdfs ?? []} />
        </>
      )}
    </div>
  );
}
