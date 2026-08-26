"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-surface-container border border-outline-variant/40 rounded-xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30 mb-4">
          <h3 className="font-display font-bold text-lg text-on-surface">{title}</h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
