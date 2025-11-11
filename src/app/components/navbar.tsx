"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface NavBarProps {
  rol?: string;
}

export default function NavBar({ rol = "externo" }: NavBarProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  // Colores según el rol
  const isAdmin = rol === "admin";

  const colorFondo = isAdmin
    ? "from-[#D4AF37] to-[#B9932C]" // dorado
    : "from-[#0A1E6A] to-[#1E3A8A]"; // azul

  const colorBoton = isAdmin
    ? "bg-gradient-to-r from-[#FAD87A] to-[#D4AF37] text-[#5C4402]"
    : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white";

  const hoverColor = "hover:brightness-110";

  const go = (path: string) => {
    router.push(`${path}?rol=${rol}`);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full bg-gradient-to-r ${colorFondo} text-white shadow-md flex justify-center items-center overflow-hidden z-50`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        height: hovered ? "70px" : "10px",
      }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`flex gap-6 items-center font-medium`}
      >
        {/* Botón Registrar */}
        <button
          onClick={() => go("/Gestion/registro")}
          className={`${colorBoton} px-5 py-2 rounded-xl shadow ${hoverColor} transition`}
        >
          Registrar
        </button>

        {/* Botón Consultar */}
        <button
          onClick={() => go("/Gestion/consultas")}
          className={`${colorBoton} px-5 py-2 rounded-xl shadow ${hoverColor} transition`}
        >
          Consultar
        </button>

        {/* Botón Salir */}
        <button
          onClick={() => {
            sessionStorage.clear();
            router.push("/login");
          }}
          className="px-5 py-2 rounded-xl bg-white/30 text-white font-semibold shadow hover:bg-white/40 transition"
        >
          Salir
        </button>
      </motion.div>
    </motion.nav>
  );
}
