"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon, Check, ChevronDown } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { useUpdateCallStatus } from "@/services/referralRequest/referralRequestMutation";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { showToast } from "@/utils/defaultToastOptions";
import CustomButton from "./custom-components/CustomButton";
import { CallStatus } from "@prisma/client";

interface UpdateCallStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralId: string;
  currentCallStatus?: string | null;
  currentCallDate?: Date | null;
  onSuccess: () => void;
}

export default function UpdateCallStatusModal({
  isOpen,
  onClose,
  referralId,
  currentCallStatus,
  currentCallDate,
  onSuccess,
}: UpdateCallStatusModalProps) {
  const [callStatus, setCallStatus] = useState<string>("PENDING");
  const [callDate, setCallDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { mutate: updateCallStatus, isPending } = useUpdateCallStatus();

  useEffect(() => {
    if (isOpen) {
      setCallStatus(currentCallStatus?.toUpperCase() || "PENDING");
      setCallDate(currentCallDate ? new Date(currentCallDate) : undefined);
    }
  }, [isOpen, currentCallStatus, currentCallDate]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = () => {
    updateCallStatus(
      {
        id: referralId,
        callStatus: callStatus.toUpperCase(),
        callDate: callDate ? callDate.toISOString() : null,
      },
      {
        onSuccess: () => {
          showToast("success", "Call status updated successfully");
          onSuccess();
          onClose();
        },
        onError: (error) => {
          const err = getAxiosErrorMessage(error);
          showToast("error", err);
        },
      },
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            className="relative bg-dashboardBarBackground rounded-2xl shadow-lg px-6 py-8 w-[480px]"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl text-green font-semibold text-center mb-6">
              Update Call Status
            </h2>

            <div className="space-y-5">
              {/* Call Status Select */}
              <div className="space-y-2">
                <label className="text-sm text-dashboardTextBlack font-medium">
                  Call Status
                </label>
                <SelectPrimitive.Root
                  value={callStatus}
                  onValueChange={setCallStatus}
                >
                  <SelectPrimitive.Trigger className="flex h-11 w-full items-center justify-between whitespace-nowrap rounded-2xl border border-gray bg-white px-4 py-2 text-sm text-dashboardTextBlack outline-none focus:ring-1 focus:ring-green">
                    <SelectPrimitive.Value />
                    <SelectPrimitive.Icon>
                      <ChevronDown className="h-4 w-4 text-dashboardTextBlack opacity-50" />
                    </SelectPrimitive.Icon>
                  </SelectPrimitive.Trigger>
                  <SelectPrimitive.Portal>
                    <SelectPrimitive.Content
                      className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-2xl border bg-white shadow-md"
                      position="popper"
                      sideOffset={4}
                    >
                      <SelectPrimitive.Viewport className="p-1">
                        {Object.values(CallStatus).map((status) => (
                          <SelectPrimitive.Item
                            key={status}
                            value={status}
                            className="relative flex w-full cursor-default select-none items-center rounded-xl py-2.5 pl-3 pr-8 text-sm text-dashboardTextBlack outline-none focus:bg-gray data-[highlighted]:bg-gray"
                          >
                            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                              <SelectPrimitive.ItemIndicator>
                                <Check className="h-4 w-4 text-green" />
                              </SelectPrimitive.ItemIndicator>
                            </span>
                            <SelectPrimitive.ItemText>
                              {status}
                            </SelectPrimitive.ItemText>
                          </SelectPrimitive.Item>
                        ))}
                      </SelectPrimitive.Viewport>
                    </SelectPrimitive.Content>
                  </SelectPrimitive.Portal>
                </SelectPrimitive.Root>
              </div>

              {/* Call Date Popover */}
              <div className="space-y-2">
                <label className="text-sm text-dashboardTextBlack font-medium">
                  Call Date
                </label>
                <PopoverPrimitive.Root
                  open={calendarOpen}
                  onOpenChange={setCalendarOpen}
                >
                  <PopoverPrimitive.Trigger asChild>
                    <button
                      type="button"
                      className="flex h-11 w-full items-center justify-between whitespace-nowrap rounded-2xl border border-gray bg-white px-4 py-2 text-sm text-dashboardTextBlack outline-none focus:ring-1 focus:ring-green"
                    >
                      <span className={callDate ? "" : "text-gray-400"}>
                        {callDate
                          ? callDate.toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Select date"}
                      </span>
                      <CalendarIcon className="h-4 w-4 text-dashboardTextBlack opacity-50" />
                    </button>
                  </PopoverPrimitive.Trigger>
                  <PopoverPrimitive.Portal>
                    <PopoverPrimitive.Content
                      className="relative z-50 rounded-2xl border bg-white p-3 shadow-md"
                      sideOffset={4}
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={callDate}
                        onSelect={(date) => {
                          setCallDate(date);
                          setCalendarOpen(false);
                        }}
                        showOutsideDays={false}
                      />
                    </PopoverPrimitive.Content>
                  </PopoverPrimitive.Portal>
                </PopoverPrimitive.Root>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-center gap-3 mt-8">
              <CustomButton
                className="w-[150px]"
                style="secondary"
                handleOnClick={onClose}
                text="Cancel"
                disabled={isPending}
              />
              <CustomButton
                className="w-[150px]"
                handleOnClick={handleSubmit}
                disabled={isPending}
                loading={isPending}
                text="Update"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
