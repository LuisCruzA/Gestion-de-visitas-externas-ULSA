"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

interface NavbarProps {
  rol: string;
}

export default function Navbar({ rol }: NavbarProps) {
  const router = useRouter();
  const [accion, setAccion] = useState<string | null>(null);

  const isAdmin = rol === "admin";
  const btnGradient = isAdmin
    ? "from-[#D4AF37] to-[#FAD87A]"
    : "from-blue-500 to-cyan-400";

  const mensajes = {
    registrar:
      " Estás en la sección de <b>Registro</b>. Aquí podrás agregar nuevos datos de visitas externas.",
    consultar:
      "Sección de <b>Consulta</b>. Aquí puedes revisar información existente.",
    salir: "Has cerrado sesión. Redirigiendo al inicio...",
  };

  const handleAccion = (tipo: string) => {
    setAccion(tipo);
    if (tipo === "registrar") router.push("/Gestion/registro");
    if (tipo === "consultar") router.push("/Gestion/consultas");
    if (tipo === "salir") setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 mt-6">
      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-md">
        {["registrar", "consultar", "salir"].map((tipo) => (
          <button
            key={tipo}
            onClick={() => handleAccion(tipo)}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl bg-gradient-to-r ${
              tipo === "salir"
                ? "from-white/10 to-white/10 border border-white/30"
                : btnGradient
            } text-white font-semibold shadow-md hover:shadow-lg transition-transform duration-200 hover:brightness-110`}
          >
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </button>
        ))}
      </div>

      {/* Mensaje dinámico */}
      <AnimatePresence>
        {accion && (
          <motion.div
            key={accion}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center text-blue-50 shadow-lg border border-white/20"
            dangerouslySetInnerHTML={{
              __html: mensajes[accion as keyof typeof mensajes],
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
