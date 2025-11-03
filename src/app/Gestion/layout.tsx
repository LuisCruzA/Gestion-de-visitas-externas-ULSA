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
  const [rol, setRol] = useState("externo");

  // Mantener rol persistente entre páginas
  useEffect(() => {
    const rolUrl = searchParams.get("rol");

    const updateRol = () => {
      if (rolUrl) {
        setRol(rolUrl);
        localStorage.setItem("rol", rolUrl);
      } else {
        const saved = localStorage.getItem("rol");
        if (saved) setRol(saved);
      }
    };

    // Ejecutar en el siguiente ciclo para evitar warning de React
    const timer = setTimeout(updateRol, 0);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const isAdmin = rol === "admin";

  //Colores dinámicos según el rol
  const colorFondo = isAdmin
    ? "from-[#FFF9E5] to-[#FDE68A]"
    : "from-[#E0E7FF] to-[#93C5FD]";
  const colorFooter = isAdmin ? "text-[#B9932C]" : "text-[#0A1E6A]";

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-b ${colorFondo} font-poppins transition-all duration-300`}
    >
      {/* Navbar global */}
      <NavBar rol={rol} />

      {/*  Contenido dinámico (páginas internas) */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-white text-center py-4 shadow-inner mt-auto border-t">
        <p className={`text-sm font-medium ${colorFooter}`}>
          © 2025 Sistema de gestión de visitas ULSA —{" "}
          {isAdmin ? "Panel Administrador" : "Panel Universitario"}
        </p>
      </footer>
    </div>
  );
}
