"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "../components/navbar";
import { useSearchParams } from "next/navigation";

export default function GestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const [isAdmin, setIsAdmin] = useState<boolean>();

  // Mantener rol persistente entre páginas
  useEffect(() => {
    const rolUrl = searchParams.get("rol");
    const isAdmin = sessionStorage.getItem("isAdmin");
    setIsAdmin(isAdmin === "true");

      }, []);

  //Colores dinámicos según el rol
  const colorFondo = !isAdmin
    ? "from-[#FFF9E5] to-[#FDE68A]"
    : "from-[#E0E7FF] to-[#93C5FD]";
  const colorFooter = !isAdmin ? "text-[#B9932C]" : "text-[#0A1E6A]";

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-b ${colorFondo} font-poppins transition-all duration-300`}
    >
      {/* Navbar global */}

      {/*  Contenido dinámico (páginas internas) */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-white text-center py-4 shadow-inner mt-auto border-t">
        <p className={`text-sm font-medium ${colorFooter}`}>
          © 2025 Sistema de gestión de visitas ULSA —{" "}
          {!isAdmin ? "Panel Administrador" : "Panel Universitario"}
        </p>
      </footer>
    </div>
  );
}
