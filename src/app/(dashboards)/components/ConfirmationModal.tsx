"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Spinner from "./custom-components/Spinner";
import { Button } from "@/components/ui/button";

interface CustomConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  title: string;
  description: string;
  cancelText?: string;
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
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-50 inset-0 flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 w-full max-w-md relative">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                onClick={onClose}
                disabled={isPending}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Description */}
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                {description}
              </p>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={isPending}
                  className="bg-green hover:bg-green/90 text-white"
                >
                  <div className="flex items-center gap-2">
                    {isPending ? <Spinner /> : confirmText}
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
