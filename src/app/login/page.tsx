"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("externo");

  // Detecta el rol seleccionado
  const isAdmin = role === "admin";

  // Colores dinámicos según el rol
  const bgGradient = isAdmin
    ? "from-[#5C4402] to-[#B9932C]" // dorado oscuro
    : "from-[#0A1E6A] to-[#1E3A8A]"; // azul institucional

  const btnGradient = isAdmin
    ? "from-[#D4AF37] to-[#FAD87A]" // botón dorado
    : "from-blue-500 to-cyan-400";   // botón azul

  // Manejo de inicio de sesión
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Redirige según el rol
    if (role === "admin") {
      router.push("/Gestion"); // Dashboard general
    } else {
      router.push("/Gestion/registro"); // Registro de citas
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-b ${bgGradient} p-6 font-poppins transition-all duration-500`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 flex flex-col gap-6"
      >
        {/* Logo simbólico */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 ${
              isAdmin
                ? "bg-gradient-to-br from-yellow-300 to-amber-400"
                : "bg-gradient-to-br from-blue-400 to-cyan-300"
            } rounded-2xl flex items-center justify-center`}
          >
            <div className="w-6 h-6 bg-white/90 rounded-full shadow-inner"></div>
          </div>
        </div>

        {/* Encabezado */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-white mb-1">
            Inicio de sesión
          </h1>
          <p className="text-blue-200 text-sm">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm text-blue-100 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col">
            <label className="text-sm text-blue-100 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              required
            />
          </div>

          {/* Selector de rol */}
          <div className="flex flex-col">
            <label className="text-sm text-blue-100 mb-1">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 appearance-none"
            >
              <option value="admin" className="text-black">
                Administrador del sistema
              </option>
              <option value="externo" className="text-black">
                Administrador universitario
              </option>
            </select>
          </div>

          {/* Botón dinámico */}
          <button
            type="submit"
            className={`mt-4 w-full py-3 rounded-xl bg-gradient-to-r ${btnGradient} text-white font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-[1.02]`}
          >
            Iniciar sesión
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-blue-200 text-sm mt-6">
          ¿No tienes cuenta?{" "}
          <a href="#" className="text-white font-medium hover:underline">
            Regístrate
          </a>
        </div>
      </motion.div>
    </div>
  );
}
