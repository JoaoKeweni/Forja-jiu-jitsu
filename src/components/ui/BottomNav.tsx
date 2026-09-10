"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/professor/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/professor/alunos", icon: "group", label: "Alunos" },
  { href: "/professor/financeiro", icon: "payments", label: "Financeiro" },
  { href: "/professor/campeonatos", icon: "emoji_events", label: "Torneios" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 border-t border-outline-variant/30 bg-surface/40 backdrop-blur-xl flex justify-around items-center h-20 pb-safe transition-transform duration-300">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-1/4 active:scale-90 transition-all font-label-bold text-label-bold ${
              isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {isActive ? (
              <div className="bg-primary/10 px-4 py-1 rounded-[12px] mb-1">
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
              </div>
            ) : (
              <span className="material-symbols-outlined text-[24px] mb-1">
                {item.icon}
              </span>
            )}
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
