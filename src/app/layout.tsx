import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FORJA - Jiu-Jitsu Management",
  description: "Plataforma SaaS de Gestão de Academias e Campeonatos de Jiu-Jitsu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" class="dark">
      <body class="bg-background text-on-surface antialiased selection:bg-primary-container selection:text-white">
        {children}
      </body>
    </html>
  );
}
