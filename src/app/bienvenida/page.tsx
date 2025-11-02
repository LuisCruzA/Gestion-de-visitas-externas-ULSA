"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/app/components/navbar";

export default function BienvenidaPage() {
  const searchParams = useSearchParams();
  const rol = searchParams.get("rol") || "externo";

  const isAdmin = rol === "admin";
  const bgGradient = isAdmin
    ? "from-[#5C4402] to-[#B9932C]"
    : "from-[#0A1E6A] to-[#1E3A8A]";

  const title = isAdmin
    ? "Bienvenido, Administrador del Sistema"
    : "Bienvenido, Administrador Universitario";

  const subtitle = isAdmin
    ? "Gestiona las visitas, usuarios y actividades del sistema."
    : "Registra y consulta las visitas externas de manera eficiente.";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b ${bgGradient} font-poppins p-8`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 border border-white/20"
      >
        {/* Logo */}
        <div
          className={`w-20 h-20 ${
            isAdmin
              ? "bg-gradient-to-br from-yellow-300 to-amber-400"
              : "bg-gradient-to-br from-blue-400 to-cyan-300"
          } rounded-3xl flex items-center justify-center shadow-md`}
        >
          <div className="w-8 h-8 bg-white/90 rounded-full shadow-inner"></div>
        </div>

        {/* Encabezado */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-blue-100 mt-2 text-base">{subtitle}</p>
        </div>

        {/* Barra de acciones */}
        <Navbar rol={rol} />
      </motion.div>

      {/* Marca institucional al fondo */}
      <p className="mt-8 text-sm text-white/70">
        Universidad La Salle Oaxaca © 2025
      </p>
    </div>
  );
}
