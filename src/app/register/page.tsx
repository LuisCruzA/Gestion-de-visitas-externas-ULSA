"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "externo",
  });

  // Detecta el rol para cambiar el color de fondo dinámicamente
  const isAdmin = form.rol === "admin";
  const bgGradient = isAdmin
    ? "from-[#5C4402] to-[#B9932C]"
    : "from-[#0A1E6A] to-[#1E3A8A]";

  const btnGradient = isAdmin
    ? "from-[#D4AF37] to-[#FAD87A]" // dorado
    : "from-blue-500 to-cyan-400"; // azul

  // Actualiza los valores del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envía el formulario y redirige al login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Usuario registrado:", form);
    router.push("/login");
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
            Crear una cuenta
          </h1>
          <p className="text-blue-200 text-sm">
            Regístrate para acceder al sistema
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {/* Nombre */}
          <div className="flex flex-col">
            <label className="text-sm text-blue-100 mb-1">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              required
            />
          </div>

          {/* Correo */}
          <div className="flex flex-col">
            <label className="text-sm text-blue-100 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
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
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              placeholder="••••••••"
              className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              required
            />
          </div>

          {/* Selector de rol */}
          <div className="flex flex-col">
            <label className="text-sm text-blue-100 mb-1">Rol</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
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
            className={`mt-4 w-full py-3 rounded-xl bg-gradient-to-r ${btnGradient} text-white font-semibold shadow-md hover:shadow-lg transition-transform hover:brightness-110`}
          >
            Registrarse
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-blue-200 text-sm mt-6">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-white font-medium hover:underline">
            Inicia sesión
          </a>
        </div>
      </motion.div>
    </div>
  );
}
