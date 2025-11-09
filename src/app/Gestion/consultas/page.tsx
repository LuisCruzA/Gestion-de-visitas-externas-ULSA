"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLogOut, FiList, FiPlus, FiDownload } from "react-icons/fi";

export default function ConsultasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nombre, setNombre] = useState("");
  
  const [rol, setRol] = useState("externo");

  // Cargar rol desde URL o localStorage
  useEffect(() => {
    const rolUrl = sessionStorage.getItem("rol");
    const saved = localStorage.getItem("rol");
    const savedName = sessionStorage.getItem("nombre");

    if (!rolUrl) {
      router.push("/login");
    } else {
      setRol(rolUrl);
      setNombre(savedName || "");
    }
    
    const actualizarRol = () => {
      if (rolUrl && rolUrl !== rol) {
        setRol(rolUrl);
        try {
          localStorage.setItem("rol", rolUrl);
        } catch {}
      } else if (!rolUrl && saved && saved !== rol) {
        setRol(saved);
      }
    };

    setTimeout(actualizarRol, 0);
  }, [searchParams, rol]);

  const isAdmin = rol === "admin";

  // 🎨 Colores dinámicos
  const colorSidebar = isAdmin ? "bg-[#916A00] text-white" : "bg-[#0A1E6A] text-white";
  const colorBtn = isAdmin
    ? "bg-[#A67C00] text-white"
    : "bg-[#0A1E6A] text-white";

  // 🔄 Navegación
  const go = (path: string) => router.push(`${path}?rol=${rol}`);

  const [filtros, setFiltros] = useState({
    fechaHora: "",
    visitante: "",
    medioIngreso: "",
    coordinacion: "",
    estado: ""
  });

  return (
    <div className="min-h-screen flex font-poppins">
      {/* Sidebar */}
      <aside className={`${colorSidebar} text-white w-64 flex flex-col justify-between py-8 px-6`}>
        <div>
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-2xl shadow-inner">
              👤
            </div>
            <p className="mt-3 font-semibold text-lg text-white">
              {isAdmin ? "Guardia" : "Universitario"}
            </p>
          </div>
          <nav className="flex flex-col gap-4">
            {!isAdmin && (
              <button
                onClick={() => go("/Gestion/registro")}
                className="text-left py-2 px-4 rounded-lg flex items-center gap-2 text-white hover:bg-white/20 transition-all"
              >
                <FiPlus className="w-5 h-5" /> Registrar cita
              </button>
            )}
            <button
              onClick={() => go("/Gestion/consultas")}
              className="text-left py-2 px-4 rounded-lg flex items-center gap-2 bg-white/20 text-white font-medium"
            >
              <FiList className="w-5 h-5" /> Consultar cita
            </button>
          </nav>
        </div>

        <button
          onClick={() => router.push("/login")}
          className="bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-all font-medium flex items-center gap-2 shadow-md"
        >
          <FiLogOut className="w-5 h-5" /> Salir
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-white">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${
              isAdmin ? "text-[#B9932C]" : "text-[#0A1E6A]"
            }`}>
              Consultar citas registradas
            </h2>
            <button
              onClick={() => {/* TODO: Implementar descarga de PDF */}}
              className={`${colorBtn} px-4 py-2 rounded-lg hover:opacity-90 transition font-medium flex items-center gap-2`}
            >
              <FiDownload className="w-5 h-5" /> Descargar PDF
            </button>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="flex flex-col">
              <select
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base font-medium bg-white shadow-sm"
                value={filtros.fechaHora}
                onChange={(e) => setFiltros({...filtros, fechaHora: e.target.value})}
              >
                <option value="" className="text-gray-600">Fecha y hora</option>
                {/* Agregar opciones según necesidades */}
              </select>
            </div>

            <div className="flex flex-col">
              <select
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base font-medium bg-white shadow-sm"
                value={filtros.visitante}
                onChange={(e) => setFiltros({...filtros, visitante: e.target.value})}
              >
                <option value="" className="text-gray-600">Visitante</option>
                {/* Agregar opciones según necesidades */}
              </select>
            </div>

            <div className="flex flex-col">
              <select
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base font-medium bg-white shadow-sm"
                value={filtros.medioIngreso}
                onChange={(e) => setFiltros({...filtros, medioIngreso: e.target.value})}
              >
                <option value="" className="text-gray-600">Medio de ingreso</option>
                <option value="vehiculo" className="text-gray-700">Vehículo</option>
                <option value="a pie" className="text-gray-700">A pie</option>
              </select>
            </div>

            <div className="flex flex-col">
              <select
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base font-medium bg-white shadow-sm"
                value={filtros.coordinacion}
                onChange={(e) => setFiltros({...filtros, coordinacion: e.target.value})}
              >
                <option value="" className="text-gray-600">Coordinación</option>
                {/* Agregar opciones según necesidades */}
              </select>
            </div>

            <div className="flex flex-col">
              <select
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base font-medium bg-white shadow-sm"
                value={filtros.estado}
                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              >
                <option value="" className="text-gray-600">Estado</option>
                {/* Agregar opciones según necesidades */}
              </select>
            </div>
          </div>

          {/* Formulario de datos */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mt-4">
            <h3 className={`text-xl font-semibold mb-4 ${
              isAdmin ? "text-[#B9932C]" : "text-[#0A1E6A]"
            }`}>
              Datos de la cita
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Número celular
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Fecha y horario
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Medio de ingreso
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Género
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Reagendar
              </button>
              <button
                className={`px-6 py-2 ${colorBtn} text-white rounded-lg hover:opacity-90 transition font-medium`}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}