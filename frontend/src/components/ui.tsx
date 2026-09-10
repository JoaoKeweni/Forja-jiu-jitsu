import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const variants = {
    primary: "bg-primary-container text-on-primary-container btn-glow",
    ghost: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
    danger: "bg-error-container text-on-error-container",
  };
  return (
    <button
      className={cn(
        "rounded-xl px-4 py-2.5 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl bg-surface-container-low border border-outline-variant px-4 py-2.5",
        "text-on-surface placeholder:text-on-surface-variant/50 input-glow",
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl bg-surface-container border border-outline-variant/40 p-5", className)}>
      {children}
    </div>
  );
}
