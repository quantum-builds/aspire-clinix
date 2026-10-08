"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
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
  theme?: "default" | "dark";
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
  theme = "default",
}: CustomConfirmationModalProps) {
  const isDark = theme === "dark";

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
          <div
            className={cn(
              "absolute inset-0 backdrop-blur-sm",
              isDark ? "bg-[#0b0a08]/70" : "bg-black/50",
            )}
          />

          {/* Modal box */}
          <motion.div
            className={cn(
              "relative",
              isDark
                ? "w-full max-w-[520px] rounded-[28px] border border-[#56493A]/45 bg-[var(--wt-card)] px-6 py-8 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] sm:px-8 sm:py-10"
                : "w-[520px] rounded-2xl bg-dashboardBarBackground px-6 py-8 shadow-lg dark:bg-neutral-900",
            )}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()} // prevent backdrop close
          >
            {/* Title & Description */}
            <div className="flex w-full flex-col items-center justify-center gap-4">
              <div>{icon && <Image src={icon} alt="icon" />}</div>
              <div className={isDark ? "space-y-3" : "space-y-[2px]"}>
                <h2
                  className={cn(
                    "text-center",
                    isDark
                      ? "font-[family-name:var(--font-cormorant)] text-[30px] font-normal leading-[36px] tracking-[0.9px] text-[var(--wt-name)] sm:text-[36px] sm:leading-[40px]"
                      : "text-2xl font-semibold text-green",
                  )}
                >
                  {title}
                </h2>
                <p
                  className={cn(
                    "text-center",
                    isDark
                      ? "font-gillSans text-base leading-7 text-[var(--wt-desc)] sm:text-lg"
                      : "text-neutral-600 dark:text-neutral-400",
                  )}
                >
                  {description}
                </p>
              </div>
            </div>

            {/* Divider (dark only) */}
            {isDark && <div className="mt-8 h-px w-full bg-white/10" />}

            {/* Footer Actions */}
            <div
              className={cn(
                "flex justify-center gap-3",
                isDark ? "mt-8 flex-col-reverse sm:flex-row" : "mt-5",
              )}
            >
              <CustomButton
                className={cn(
                  isDark
                    ? "h-9 w-full border border-white/15 !bg-white/5 py-[10px] font-gillSans font-medium uppercase tracking-wide !text-[var(--wt-name)] hover:!bg-white/10 sm:w-[163.5px]"
                    : "w-[150px]",
                )}
                style="secondary"
                textSize={isDark ? 14 : undefined}
                handleOnClick={onClose}
                text={cancelText}
                disabled={isPending}
              />
              <CustomButton
                className={isDark ? "w-full sm:w-[163.5px]" : "w-[150px]"}
                style={isDark ? "theme" : "primary"}
                textSize={isDark ? 14 : undefined}
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