"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function BienvenidaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rol = searchParams.get("rol") || "externo";
  const [accion, setAccion] = useState<string | null>(null);

  const isAdmin = rol === "admin";
  const bgGradient = isAdmin
    ? "from-[#5C4402] to-[#B9932C]"
    : "from-[#0A1E6A] to-[#1E3A8A]";
  const btnGradient = isAdmin
    ? "from-[#D4AF37] to-[#FAD87A]"
    : "from-blue-500 to-cyan-400";

  const handleAccion = (tipo: string) => {
    setAccion(tipo);
    if (tipo === "registrar") {
      router.push(`/Gestion/registro?rol=${rol}`);
    } else if (tipo === "consultar") {
      router.push(`/Gestion/consultas?rol=${rol}`);
    } else if (tipo === "salir") {
      router.push("/login");
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b ${bgGradient} p-6 font-poppins transition-all duration-500`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-8"
      >
        {/* Logo */}
        <div
          className={`w-20 h-20 ${
            isAdmin
              ? "bg-gradient-to-br from-yellow-300 to-amber-400"
              : "bg-gradient-to-br from-blue-400 to-cyan-300"
          } rounded-3xl flex items-center justify-center`}
        >
          <div className="w-8 h-8 bg-white/90 rounded-full shadow-inner"></div>
        </div>

        <h1 className="text-3xl font-semibold text-white text-center">
          Bienvenido{isAdmin ? ", Administrador" : ", Usuario"}
        </h1>
        <p className="text-blue-200 text-center max-w-md">
          Selecciona una acción para continuar con tu sesión.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            onClick={() => handleAccion("registrar")}
            className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${btnGradient} text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-transform`}
          >
            Registrar
          </button>

          <button
            onClick={() => handleAccion("consultar")}
            className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${btnGradient} text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-transform`}
          >
            Consultar
          </button>

          <button
            onClick={() => handleAccion("salir")}
            className="flex-1 py-3 rounded-xl bg-white/20 border border-white/30 text-white font-semibold shadow-md hover:bg-white/30 hover:scale-[1.03] transition-transform"
          >
            Salir
          </button>
        </div>
      </motion.div>
    </div>
  );
}
