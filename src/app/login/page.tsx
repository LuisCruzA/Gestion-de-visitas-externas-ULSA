"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// 🔹 Interfaz opcional para tipado futuro (backend)
interface Usuario {
  correo: string;
  contrasena: string;
  rol: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("externo");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const isAdmin = role === "admin";

  // 🎨 Colores dinámicos según rol
  const bgGradient = isAdmin
    ? "from-[#5C4402] to-[#B9932C]"
    : "from-[#0A1E6A] to-[#1E3A8A]";
  const btnGradient = isAdmin
    ? "from-[#D4AF37] to-[#FAD87A]"
    : "from-blue-500 to-cyan-400";

  // 🔹 Manejo del inicio de sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (!correo.trim() || !contrasena.trim()) {
        throw new Error("Por favor, completa todos los campos.");
      }

      // 🔸 Aquí puedes integrar backend si lo deseas
      // const res = await fetch("/api/login", {...});

      // ✅ Guardar el rol en localStorage
      try {
        localStorage.setItem("rol", role);
      } catch {}

      // ✅ Redirigir correctamente a /Gestion (pantalla de bienvenida)
      router.push(`/Gestion?rol=${role}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al iniciar sesión.");
      }
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
        {/* 🔸 Logo */}
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

        {/* 🔸 Encabezado */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-white mb-1">
            Inicio de sesión
          </h1>
          <p className="text-blue-200 text-sm">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* 🔸 Formulario */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col">
            <label className="text-sm text-blue-100 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-blue-100 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              required
            />
          </div>

          {/* 🔸 Selector de rol */}
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
                Usuario externo / Universitario
              </option>
            </select>
          </div>

          {/* 🔸 Mensaje de error */}
          {error && (
            <p className="text-red-300 text-sm text-center mt-2">{error}</p>
          )}

          {/* 🔸 Botón dinámico */}
          <button
            type="submit"
            className={`mt-2 w-full py-3 rounded-xl bg-gradient-to-r ${btnGradient} text-white font-semibold shadow-md hover:shadow-lg transition-transform hover:brightness-110`}
          >
            Iniciar sesión
          </button>
        </form>

        {/* 🔸 Footer */}
        <div className="text-center text-blue-200 text-sm mt-6">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-white font-medium hover:underline">
            Regístrate
          </a>
        </div>
      </motion.div>
    </div>
  );
}
