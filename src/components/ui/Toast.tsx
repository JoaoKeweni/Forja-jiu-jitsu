"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  type?: "success" | "warning" | "error";
}

export default function Toast({ message, isOpen, onClose, type = "success" }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bgStyles = {
    success: "bg-primary-container border-primary/50 text-white",
    warning: "bg-amber-600/90 border-amber-400/50 text-white",
    error: "bg-error-container border-error/50 text-white",
  };

  const icons = {
    success: "check_circle",
    warning: "warning",
    error: "error",
  };

  return (
    <div
      class={`fixed top-20 right-4 z-[9999] ${bgStyles[type]} px-4 py-3 rounded-lg shadow-2xl font-bold text-sm flex items-center gap-2 border animate-bounce`}
    >
      <span class="material-symbols-outlined text-lg">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
