"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CustomButton from "./custom-components/CustomButton";

interface CustomConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  title: string;
  description: string;
  cancelText?: string;
  icon?: string;
  confirmText?: string;
}

export default function CustomConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Confirm",
  icon,
}: CustomConfirmationModalProps) {
  // Prevent background scroll when modal is open
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // clicking backdrop closes modal
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal box */}
          <motion.div
            className="relative bg-dashboardBarBackground dark:bg-neutral-900 rounded-2xl shadow-lg px-6 py-8 w-[520px]"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()} // prevent backdrop close
          >
            {/* Title & Description */}
            <div className="flex flex-col gap-4 justify-center items-center w-full">
              <div>{icon && <Image src={icon} alt="icon" />}</div>
              <div className="space-y-[2px]">
                <h2 className="text-2xl text-green font-semibold text-center">
                  {title}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-center">
                  {description}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-center gap-3 mt-5">
              <CustomButton
                className="w-[150px]"
                style="secondary"
                handleOnClick={onClose}
                text={cancelText}
                disabled={isPending}
              />
              <CustomButton
                className="w-[150px]"
                handleOnClick={onConfirm}
                disabled={isPending}
                loading={isPending}
                text={confirmText}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
