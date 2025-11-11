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
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");


  // 🎨 Colores dinámicos según rol
  const btnGradient = false
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

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión.");
      }

      // ✅ Guardar el rol en localStorage
        const rol = data.admin.esSuperadmin ? "superadmin" : "admin";
        sessionStorage.setItem("rol", rol);
        sessionStorage.setItem("nombre", data.admin.nombre);
        sessionStorage.setItem("correo", data.admin.correo);
        sessionStorage.setItem("id", data.admin.id_admin);
        sessionStorage.setItem("area", data.admin.areaAdmin);

      // ✅ Redirigir correctamente a /Gestion (pantalla de bienvenida)
      router.push(`/Gestion?rol=${rol}`);
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
  className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-cyan-600 p-6 font-poppins transition-all duration-500"
>
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 flex flex-col gap-6 border border-white/20"
  >
    {/* Logo */}
    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-inner">
        <div className="w-6 h-6 bg-white/90 rounded-full"></div>
      </div>
    </div>

    {/* Encabezado */}
    <div className="text-center">
      <h1 className="text-3xl font-semibold text-white mb-1">Inicio de sesión</h1>
      <p className="text-blue-200 text-sm">Ingresa tus credenciales para continuar</p>
    </div>

    {/* Formulario */}
    <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col">
        <label className="text-sm text-blue-100 mb-1">Correo electrónico</label>
        <input
          type="email"
          placeholder="tucorreo@ejemplo.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
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
          className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
          required
        />
      </div>

      {error && <p className="text-red-300 text-sm text-center mt-2">{error}</p>}

      <button
        type="submit"
        className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition-all"
      >
        Iniciar sesión
      </button>
    </form>
  </motion.div>
</div>

  )
}
