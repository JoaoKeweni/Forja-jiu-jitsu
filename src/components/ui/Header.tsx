"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  academyName?: string;
  userImage?: string;
  pendingCount?: number;
  showNotification?: boolean;
}

export default function Header({
  academyName = "Gracie Barra Matriz",
  userImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuC7yhi0IJUhygLU0O_fmxJGCDVzdB-LLQFTmysSWNkqpTTat8-TUBTNAjTsLHbUpGVCyS99pZVCda5sbJh53lWHKP8GGyJeVSjB9YcTkPS3773uy-Z9a4NL-yCUv4f_KMxeSjA4Dc7WcUolMpK9zU483rVCwaF_tPrtRh50dcYTdTaVXnUq1fc1yrPJTFl1A1dXDjA5xVILN888fDeCDmKX3u_M14lHyhH9PTAHXyIWyF0lbeS0vKce",
  pendingCount = 2,
  showNotification = true,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 flex justify-between items-center px-6 h-16 transition-all">
      <div className="flex items-center gap-4">
        <Link href="/professor/dashboard" className="flex items-center gap-3">
          <img
            src={userImage}
            alt="Professor"
            className="w-10 h-10 rounded-full object-cover border border-outline-variant/50"
          />
          <div>
            <span className="font-display text-xl tracking-tighter text-primary italic uppercase font-black">
              FORJA
            </span>
            <div className="text-[10px] text-on-surface-variant font-mono -mt-1 hidden sm:block">
              {academyName}
            </div>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {showNotification && (
          <button
            onClick={() => router.push("/professor/aprovacao")}
            className="relative p-2 text-on-surface-variant hover:text-primary transition-colors active:scale-95 rounded-full hover:bg-surface-container"
            title="Aprovações Pendentes"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              notifications
            </span>
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary-container rounded-full animate-pulse ring-2 ring-background" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
