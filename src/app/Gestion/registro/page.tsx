"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLogOut, FiList, FiPlus } from "react-icons/fi";

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

  const [rol, setRol] = useState<string>("externo");
  const [paso, setPaso] = useState(1);
  const [exito, setExito] = useState(false);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [tocado, setTocado] = useState(false);

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

  // ✅ Carga segura del rol sin error de cascada
  useEffect(() => {
    if (typeof window === "undefined") return;
    const rolUrl = searchParams.get("rol");
    const saved = localStorage.getItem("rol");
    if (rolUrl && rolUrl !== rol) {
      setTimeout(() => {
        setRol(rolUrl);
        localStorage.setItem("rol", rolUrl);
      }, 0);
    } else if (!rolUrl && saved && saved !== rol) {
      setTimeout(() => setRol(saved), 0);
    }
  }, [searchParams]);

  const isAdmin = rol === "admin";

  // 🎨 Colores dinámicos
  const colorPrincipal = isAdmin
    ? "bg-[#A67C00]"  // Dorado oscuro profesional
    : "bg-[#1E3A8A]"; // Azul fuerte
  const colorSidebar = isAdmin ? "bg-[#916A00]" : "bg-[#0A1E6A]";
  const colorBtn = isAdmin
    ? "bg-[#A67C00]"  // Dorado oscuro para botones
    : "bg-[#0A1E6A]"; // Azul oscuro para botones

  // 🔄 Manejo de navegación
  const go = (path: string) => router.push(`${path}?rol=${rol}`);

  // 🔄 Cambios de formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
  };

  // ✅ Validaciones
  const validarPaso = () => {
    const nuevosErrores: { [key: string]: string } = {};
    if (paso === 1) {
      if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
      if (!form.ine.trim()) nuevosErrores.ine = "El INE es obligatorio.";
      if (!form.genero.trim()) nuevosErrores.genero = "El género es obligatorio.";
      if (!form.correo.trim()) nuevosErrores.correo = "El correo es obligatorio.";
      if (!form.nacimiento.trim())
        nuevosErrores.nacimiento = "La fecha de nacimiento es obligatoria.";
      if (!form.telefono.trim())
        nuevosErrores.telefono = "El teléfono es obligatorio.";
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

  // 🧭 Navegación
  const limpiarCamposPaso = (numeroPaso: number) => {
    switch (numeroPaso) {
      case 1:
        // Limpiar campos del paso 1
        setForm(prev => ({
          ...prev,
          nombre: "",
          ine: "",
          genero: "",
          correo: "",
          nacimiento: "",
          telefono: ""
        }));
        break;
      case 2:
        // Limpiar campos del paso 2
        setForm(prev => ({
          ...prev,
          fechaVisita: "",
          personaVisita: "",
          area: ""
        }));
        break;
      case 3:
        // Limpiar campos del paso 3
        setForm(prev => ({
          ...prev,
          medioIngreso: "",
          marca: "",
          modelo: ""
        }));
        break;
    }
  };

  const siguientePaso = () => {
    setTocado(true);
    if (validarPaso()) {
      setTocado(false);
      if (paso < 3) {
        const siguientePasoNum = paso + 1;
        // Guardar temporalmente los datos del paso actual
        const datosActuales = {...form};
        // Limpiar campos del siguiente paso
        limpiarCamposPaso(siguientePasoNum);
        setPaso(siguientePasoNum);
        // Restaurar solo los campos del paso anterior
        setTimeout(() => {
          switch (paso) {
            case 1:
              setForm(prev => ({
                ...prev,
                nombre: datosActuales.nombre,
                ine: datosActuales.ine,
                genero: datosActuales.genero,
                correo: datosActuales.correo,
                nacimiento: datosActuales.nacimiento,
                telefono: datosActuales.telefono
              }));
              break;
            case 2:
              setForm(prev => ({
                ...prev,
                fechaVisita: datosActuales.fechaVisita,
                personaVisita: datosActuales.personaVisita,
                area: datosActuales.area
              }));
              break;
          }
        }, 0);
      }
    }
  };

  const pasoAnterior = () => {
    setErrores({});
    setTocado(false);
    if (paso > 1) {
      const pasoAnteriorNum = paso - 1;
      // Guardar temporalmente los datos del paso actual
      const datosActuales = {...form};
      // Limpiar campos del paso anterior
      limpiarCamposPaso(pasoAnteriorNum);
      setPaso(pasoAnteriorNum);
      // Restaurar solo los campos del paso anterior
      setTimeout(() => {
        switch (pasoAnteriorNum) {
          case 1:
            setForm(prev => ({
              ...prev,
              nombre: datosActuales.nombre,
              ine: datosActuales.ine,
              genero: datosActuales.genero,
              correo: datosActuales.correo,
              nacimiento: datosActuales.nacimiento,
              telefono: datosActuales.telefono
            }));
            break;
          case 2:
            setForm(prev => ({
              ...prev,
              fechaVisita: datosActuales.fechaVisita,
              personaVisita: datosActuales.personaVisita,
              area: datosActuales.area
            }));
            break;
        }
      }, 0);
    }
  };

  const cancelar = () => {
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
    setTocado(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTocado(true);
    if (!validarPaso()) return;
    setExito(true);
  };

  // 🟢 Éxito
  if (exito) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-gray-50">
        <nav
          className={`${colorPrincipal} shadow-xl px-10 py-4 flex justify-between items-center`}
        >
          <h1 className="text-xl font-bold text-white">
            {isAdmin ? "Panel Administrador" : "Panel Universitario"}
          </h1>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition text-white"
          >
            Cerrar sesión
          </button>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center flex-1 bg-gray-100"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-lg w-full border">
            <h2 className={`text-2xl font-bold mb-3 ${
              isAdmin ? 'text-[#A67C00]' : 'text-[#0A1E6A]'
            }`}>
              ¡Registro exitoso!
            </h2>
            <p className="text-gray-600 mb-6">
              La cita ha sido registrada correctamente.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setExito(false);
                  cancelar();
                  setPaso(1);
                }}
                className={`${colorBtn} text-white px-6 py-3 rounded-xl shadow-md hover:brightness-110 transition flex items-center gap-2`}
              >
                <FiPlus className="w-5 h-5" />
                Registrar otra cita
              </button>
              <button
                onClick={() => go("/Gestion/consultas")}
                className={`${
                  isAdmin 
                    ? 'bg-[#8B6B00]'  // Dorado más oscuro para contraste
                    : 'bg-[#1e3a8a]'  // Azul fuerte para consultas
                } text-white px-6 py-3 rounded-xl shadow-md hover:brightness-110 transition font-semibold flex items-center gap-2`}
              >
                <FiList className="w-5 h-5" />
                Consultar citas
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // 🧾 Formulario
  return (
    <div className={`min-h-screen flex font-poppins bg-gradient-to-b ${colorPrincipal}`}>
      {/* Sidebar */}
      <aside className={`${colorSidebar} text-white w-64 flex flex-col justify-between py-8 px-6`}>
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
              <FiPlus className="w-5 h-5" /> Registrar cita
            </button>
            <button
              onClick={() => go("/Gestion/consultas")}
              className="text-left py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-white/10"
            >
              <FiList className="w-5 h-5" /> Consultar cita
            </button>
          </nav>
        </div>

        <button
          onClick={() => router.push("/login")}
          className="bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-all font-medium flex items-center gap-2"
        >
          <FiLogOut className="w-5 h-5" /> Salir
        </button>
      </aside>

      {/* Formulario principal */}
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

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-8"
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
                    { name: "nombre", label: "Nombre completo", type: "text" },
                    { name: "ine", label: "INE", type: "text" },
                    { name: "correo", label: "Correo electrónico", type: "email" },
                    { name: "nacimiento", label: "Fecha de nacimiento", type: "date" },
                    { name: "telefono", label: "Número celular", type: "text" },
                  ].map(({ name, label, type }) => (
                    <div key={name} className="flex flex-col">
                      <label className="text-gray-600 mb-1">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={form[name as keyof FormData]}
                        onChange={handleChange}
                        className={`border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 ${
                          isAdmin
                            ? "focus:ring-yellow-400"
                            : "focus:ring-blue-400"
                        }`}
                      />
                      {tocado && errores[name] && (
                        <span className="text-red-500 text-sm mt-1">
                          {errores[name]}
                        </span>
                      )}
                    </div>
                  ))}
                  
                  {/* Campo de género separado como select */}
                  <div className="flex flex-col">
                    <label className="text-gray-600 mb-1">Género</label>
                    <select
                      name="genero"
                      value={form.genero}
                      onChange={handleChange}
                      className={`border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 ${
                        isAdmin
                          ? "focus:ring-yellow-400"
                          : "focus:ring-blue-400"
                      }`}
                    >
                      <option value="">Selecciona un género</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Otro">Otro</option>
                    </select>
                    {tocado && errores.genero && (
                      <span className="text-red-500 text-sm mt-1">
                        {errores.genero}
                      </span>
                    )}
                  </div>
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
                      className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {tocado && errores.fechaVisita && (
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
                      className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {tocado && errores.personaVisita && (
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
                      className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {tocado && errores.area && (
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
                      className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Selecciona medio de ingreso</option>
                      <option value="a pie">A pie</option>
                      <option value="vehiculo">Vehículo</option>
                    </select>
                    {tocado && errores.medioIngreso && (
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
                          className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {tocado && errores.marca && (
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
                          className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {tocado && errores.modelo && (
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

          {/* Botones */}
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
                onClick={cancelar}
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
                className={`${colorBtn} text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:brightness-110 transition`}
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
