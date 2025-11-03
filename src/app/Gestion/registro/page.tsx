"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

// 🔹 Interfaz tipada
interface FormData {
  nombre: string;
  ine: string;
  genero: string;
  correo: string;
  nacimiento: string;
  telefono: string;
  fechaVisita: string;
  personaVisita: string;
  area: string;
  medioIngreso: string;
  marca: string;
  modelo: string;
}

export default function RegistroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🧩 Estados principales
  const [rol, setRol] = useState<string>("externo");
  const [paso, setPaso] = useState(1);
  const [exito, setExito] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState<FormData>({
    nombre: "",
    ine: "",
    genero: "",
    correo: "",
    nacimiento: "",
    telefono: "",
    fechaVisita: "",
    personaVisita: "",
    area: "",
    medioIngreso: "",
    marca: "",
    modelo: "",
  });

  // ✅ Mantener rol persistente entre páginas
  useEffect(() => {
    let mounted = true;
    const rolUrl = searchParams.get("rol");

    setTimeout(() => {
      if (!mounted) return;
      if (rolUrl) {
        setRol(rolUrl);
        localStorage.setItem("rol", rolUrl);
      } else {
        const saved = localStorage.getItem("rol");
        setRol(saved || "externo");
      }
    }, 0);

    return () => {
      mounted = false;
    };
  }, [searchParams]);

  const isAdmin = rol === "admin";

  // 🎨 Colores según el rol
  const colorPrincipal = isAdmin
    ? "from-[#D4AF37] to-[#B9932C]"
    : "from-[#0A1E6A] to-[#1E3A8A]";
  const colorSidebar = isAdmin ? "bg-[#B9932C]" : "bg-[#0A1E6A]";
  const colorBtn = isAdmin
    ? "bg-gradient-to-r from-[#D4AF37] to-[#FAD87A]"
    : "bg-gradient-to-r from-blue-500 to-cyan-400";
  const colorFocus = isAdmin ? "focus:ring-yellow-400" : "focus:ring-blue-400";

  const go = (path: string) => router.push(`${path}?rol=${rol}`);

  // 🔄 Manejo de cambios
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Validación por pasos
  const validarPaso = () => {
    const nuevosErrores: { [key: string]: string } = {};
    if (paso === 1) {
      if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
      if (!form.ine.trim()) nuevosErrores.ine = "El INE es obligatorio.";
      if (!form.correo.trim()) nuevosErrores.correo = "El correo es obligatorio.";
      if (!form.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio.";
    }
    if (paso === 2) {
      if (!form.fechaVisita.trim())
        nuevosErrores.fechaVisita = "Debes ingresar fecha y hora.";
      if (!form.personaVisita.trim())
        nuevosErrores.personaVisita = "Debes indicar a quién visitas.";
      if (!form.area.trim())
        nuevosErrores.area = "Debes indicar el área o departamento.";
    }
    if (paso === 3) {
      if (!form.medioIngreso.trim())
        nuevosErrores.medioIngreso = "Selecciona un medio de ingreso.";
      if (form.medioIngreso === "vehiculo") {
        if (!form.marca.trim()) nuevosErrores.marca = "La marca es obligatoria.";
        if (!form.modelo.trim()) nuevosErrores.modelo = "El modelo es obligatorio.";
      }
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const siguientePaso = () => validarPaso() && setPaso((p) => Math.min(p + 1, 3));
  const pasoAnterior = () => setPaso((p) => Math.max(p - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarPaso()) return;
    setExito(true);
  };

  // ✅ Pantalla final (éxito)
  if (exito) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-gray-50">
        {/* Navbar superior */}
        <nav
          className={`bg-gradient-to-r ${colorPrincipal} text-white shadow-xl px-10 py-4 flex justify-between items-center relative`}
        >
          <h1 className="text-xl font-bold tracking-wide">
            {isAdmin ? "Panel Administrador" : "Panel Universitario"}
          </h1>
          <div className="relative">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all shadow-md"
            >
              <span>👤 {isAdmin ? "Administrador" : "Usuario"}</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${menuAbierto ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            <AnimatePresence>
              {menuAbierto && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 bg-white text-gray-700 shadow-lg rounded-xl py-2 w-48 z-10 border border-gray-100"
                >
                  <button
                    onClick={() => {
                      localStorage.removeItem("rol");
                      router.push("/login");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 rounded-b-xl"
                  >
                    Cerrar sesión
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Mensaje de éxito */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center flex-1 bg-gray-100"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-lg w-full border border-gray-200">
            <h2 className="text-2xl font-bold text-green-600 mb-3">
              ¡Registro exitoso!
            </h2>
            <p className="text-gray-600 mb-6">
              La cita ha sido registrada correctamente.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setExito(false);
                  setPaso(1);
                  setForm({
                    nombre: "",
                    ine: "",
                    genero: "",
                    correo: "",
                    nacimiento: "",
                    telefono: "",
                    fechaVisita: "",
                    personaVisita: "",
                    area: "",
                    medioIngreso: "",
                    marca: "",
                    modelo: "",
                  });
                  setErrores({});
                }}
                className={`${colorBtn} text-white px-6 py-3 rounded-xl shadow-md hover:brightness-110 transition`}
              >
                Registrar otra cita
              </button>

              <button
                onClick={() => go("/Gestion/consultas")}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold rounded-xl shadow-md hover:brightness-110 transition"
              >
                Consultar citas
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // 🧾 Formulario principal
  return (
    <div className={`min-h-screen flex font-poppins bg-gradient-to-b ${colorPrincipal}`}>
      {/* Sidebar */}
      <aside className={`${colorSidebar} text-white w-64 flex flex-col justify-start py-8 px-6`}>
        <div>
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              👤
            </div>
            <p className="mt-3 font-semibold text-lg">
              {isAdmin ? "Administrador" : "Universitario"}
            </p>
          </div>
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => setPaso(1)}
              className={`text-left py-2 px-4 rounded-lg flex items-center gap-2 ${
                paso === 1 ? "bg-white/25" : "hover:bg-white/10"
              }`}
            >
              <span>➕</span> Registrar cita
            </button>
            <button
              onClick={() => go("/Gestion/consultas")}
              className="text-left py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-white/10"
            >
              <span>ℹ️</span> Consultar cita
            </button>
          </nav>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-white p-10 rounded-tl-3xl shadow-inner overflow-y-auto">
        <h1
          className={`text-2xl font-bold mb-2 ${
            isAdmin ? "text-[#B9932C]" : "text-[#0A1E6A]"
          }`}
        >
          Registrar nueva visita
        </h1>
        <p className="text-gray-500 mb-8">
          Ingresa los datos correspondientes para registrar una cita.
        </p>

        {/* Pasos del formulario */}
        <div className="flex items-center gap-6 mb-10">
          {["Datos personales", "Datos de la cita", "Medio de ingreso"].map(
            (label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`px-5 py-2 rounded-full text-sm font-semibold ${
                    paso === i + 1
                      ? `${colorSidebar} text-white`
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {i + 1} {label}
                </div>
                {i < 2 && (
                  <div className="w-6 h-[2px] bg-gray-300 rounded-full"></div>
                )}
              </div>
            )
          )}
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-300 rounded-2xl shadow-2xl p-8"
        >
          <AnimatePresence mode="wait">
            {/* Paso 1 */}
            {paso === 1 && (
              <motion.div
                key="paso1"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className={`font-semibold text-lg mb-4 ${
                    isAdmin ? "text-[#B9932C]" : "text-[#0A1E6A]"
                  }`}
                >
                  1 Datos personales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[ 
                    { name: "nombre", label: "Nombre completo" },
                    { name: "ine", label: "INE" },
                    { name: "genero", label: "Género" },
                    { name: "correo", label: "Correo electrónico" },
                    { name: "nacimiento", label: "Fecha de nacimiento" },
                    { name: "telefono", label: "Número celular" },
                  ].map(({ name, label }) => (
                    <div key={name} className="flex flex-col">
                      <label className="text-gray-600 mb-1">{label}</label>
                      <input
                        type={name === "correo" ? "email" : "text"}
                        name={name}
                        value={form[name as keyof FormData]}
                        onChange={handleChange}
                        className={`border ${
                          errores[name] ? "border-red-400" : "border-gray-300"
                        } rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none ${colorFocus}`}
                      />
                      {errores[name] && (
                        <span className="text-red-500 text-sm mt-1">
                          {errores[name]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Paso 2 */}
            {paso === 2 && (
              <motion.div
                key="paso2"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className={`font-semibold text-lg mb-4 ${
                    isAdmin ? "text-[#B9932C]" : "text-[#0A1E6A]"
                  }`}
                >
                  2 Datos de la cita
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-gray-600 mb-1">
                      Fecha y horario
                    </label>
                    <input
                      type="datetime-local"
                      name="fechaVisita"
                      value={form.fechaVisita}
                      onChange={handleChange}
                      className={`border ${
                        errores.fechaVisita
                          ? "border-red-400"
                          : "border-gray-300"
                      } rounded-lg p-3 bg-gray-50 text-gray-800 ${colorFocus}`}
                    />
                    {errores.fechaVisita && (
                      <span className="text-red-500 text-sm mt-1">
                        {errores.fechaVisita}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 mb-1">
                      Persona a quien visita
                    </label>
                    <input
                      type="text"
                      name="personaVisita"
                      value={form.personaVisita}
                      onChange={handleChange}
                      className={`border ${
                        errores.personaVisita
                          ? "border-red-400"
                          : "border-gray-300"
                      } rounded-lg p-3 bg-gray-50 text-gray-800 ${colorFocus}`}
                    />
                    {errores.personaVisita && (
                      <span className="text-red-500 text-sm mt-1">
                        {errores.personaVisita}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="text-gray-600 mb-1">
                      Área o departamento
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={form.area}
                      onChange={handleChange}
                      className={`border ${
                        errores.area ? "border-red-400" : "border-gray-300"
                      } rounded-lg p-3 bg-gray-50 text-gray-800 ${colorFocus}`}
                    />
                    {errores.area && (
                      <span className="text-red-500 text-sm mt-1">
                        {errores.area}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Paso 3 */}
            {paso === 3 && (
              <motion.div
                key="paso3"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className={`font-semibold text-lg mb-4 ${
                    isAdmin ? "text-[#B9932C]" : "text-[#0A1E6A]"
                  }`}
                >
                  3 Medio de ingreso
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-gray-600 mb-1">
                      Medio de ingreso
                    </label>
                    <select
                      name="medioIngreso"
                      value={form.medioIngreso}
                      onChange={handleChange}
                      className={`border ${
                        errores.medioIngreso
                          ? "border-red-400"
                          : "border-gray-300"
                      } rounded-lg p-3 bg-gray-50 text-gray-800 ${colorFocus}`}
                    >
                      <option value="">Selecciona medio de ingreso</option>
                      <option value="a pie">A pie</option>
                      <option value="vehiculo">Vehículo</option>
                    </select>
                    {errores.medioIngreso && (
                      <span className="text-red-500 text-sm mt-1">
                        {errores.medioIngreso}
                      </span>
                    )}
                  </div>

                  {form.medioIngreso === "vehiculo" && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-gray-600 mb-1">
                          Marca del vehículo
                        </label>
                        <input
                          type="text"
                          name="marca"
                          value={form.marca}
                          onChange={handleChange}
                          className={`border ${
                            errores.marca
                              ? "border-red-400"
                              : "border-gray-300"
                          } rounded-lg p-3 bg-gray-50 text-gray-800 ${colorFocus}`}
                        />
                        {errores.marca && (
                          <span className="text-red-500 text-sm mt-1">
                            {errores.marca}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <label className="text-gray-600 mb-1">
                          Modelo del vehículo
                        </label>
                        <input
                          type="text"
                          name="modelo"
                          value={form.modelo}
                          onChange={handleChange}
                          className={`border ${
                            errores.modelo
                              ? "border-red-400"
                              : "border-gray-300"
                          } rounded-lg p-3 bg-gray-50 text-gray-800 ${colorFocus}`}
                        />
                        {errores.modelo && (
                          <span className="text-red-500 text-sm mt-1">
                            {errores.modelo}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botones de navegación */}
          <div className="flex justify-between mt-10">
            {paso > 1 ? (
              <button
                type="button"
                onClick={pasoAnterior}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition font-medium"
              >
                Anterior
              </button>
            ) : (
              <button
                type="button"
                onClick={() => go("/bienvenida")}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition font-medium"
              >
                Cancelar
              </button>
            )}

            {paso < 3 ? (
              <button
                type="button"
                onClick={siguientePaso}
                className={`${colorBtn} text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:brightness-110 transition`}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 rounded-lg text-white font-semibold shadow-md bg-gradient-to-r from-green-500 to-green-400 hover:brightness-110 transition"
              >
                Finalizar
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
