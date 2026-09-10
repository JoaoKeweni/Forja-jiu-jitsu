"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Toast({ message, isOpen, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen && !visible) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-[9999] bg-primary-container text-white px-4 py-3 rounded-lg shadow-2xl font-label-bold text-sm flex items-center gap-2 border border-primary/50 transition-all duration-300 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      }`}
    >
      <span className="material-symbols-outlined text-lg">check_circle</span>
      <span>{message}</span>
    </div>
  );
}
