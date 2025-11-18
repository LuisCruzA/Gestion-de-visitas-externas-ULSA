"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut, FiList, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";


// Formulario y lógica del formulario
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


interface FormProps {
  form: FormData;
  errores: { [key in keyof FormData]?: string }; // Ahora, los errores tienen claves de FormData
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  tocado: boolean;
}
interface SidebarProps {
  rol: string;
  showHeader?: boolean;
  headerTitle?: string;
  headerDescription?: string;
  children?: React.ReactNode;
  mode?: "registro" | "consulta";
}

export function useFormLogic() {
  const [paso, setPaso] = useState(1);
  const [idAdmin, setIdAdmin] = useState<number | null>(null);
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
  const [errores, setErrores] = useState<{[key: string]: string}>({});
  const [tocado, setTocado] = useState(false);
  const [exito, setExito] = useState(false);

  useEffect(() => {
      const idadmin = sessionStorage.getItem("id");

      if (idadmin) {
        setIdAdmin(Number(idadmin));
      }
    }, []);

  const validarPaso = () => {
    const nuevosErrores: {[key: string]: string} = {};
    if (paso === 1) {
      if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
      if (!form.ine.trim()) nuevosErrores.ine = "El INE es obligatorio.";
      if (!form.genero.trim()) nuevosErrores.genero = "El género es obligatorio.";
      if (!form.correo.trim()) nuevosErrores.correo = "El correo es obligatorio.";
      if (!form.nacimiento.trim()) {
        nuevosErrores.nacimiento = "La fecha de nacimiento es obligatoria.";
      } else {
        // 🧠 Validar que tenga al menos 15 años
        const fechaNacimiento = new Date(form.nacimiento);
        const hoy = new Date();

        const edad =
          hoy.getFullYear() -
          fechaNacimiento.getFullYear() -
          (hoy < new Date(hoy.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate()) ? 1 : 0);

        if (edad < 15) {
          nuevosErrores.nacimiento = "Debes tener al menos 15 años para continuar.";
        }
      }
      if (!form.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio.";
      
      // Validar formato de correo
      if (form.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
        nuevosErrores.correo = "El formato del correo no es válido.";
      }
      
      // Validar formato de teléfono (10 dígitos)
      if (form.telefono && !/^\d{10}$/.test(form.telefono)) {
        nuevosErrores.telefono = "El teléfono debe tener 10 dígitos.";
      }
    }
    if (paso === 2) {
      if (!form.fechaVisita.trim()) {
        nuevosErrores.fechaVisita = "Debes ingresar fecha y hora.";
      } else {
        const fecha = new Date(form.fechaVisita);
        const ahora = new Date();
        if (fecha < ahora) {
          nuevosErrores.fechaVisita = "La fecha no puede ser anterior a hoy.";
        }

        const dia = fecha.getDay();
        const hora = fecha.getHours();
        const minutos = fecha.getMinutes();

        if (dia === 0) {
          nuevosErrores.fechaVisita = "No se pueden agendar citas en domingo.";
        } else if (dia === 6 && (hora > 16 || (hora === 16 && minutos > 0))) {
          nuevosErrores.fechaVisita = "Los sábados solo se pueden agendar citas hasta las 4:00 PM.";
        }

        // 🕒 Verificar disponibilidad de horario
        // Solo ejecutar si no hay errores hasta este punto
        if (Object.keys(nuevosErrores).length === 0) {
          // Esta validación será asíncrona
          return fetch(`/api/citas?fecha=${fecha.toISOString().split("T")[0]}&adminId=${idAdmin}`)
            .then(res => res.json())
            .then((citas: { fecha: string }[]) => {
              const conflicto = citas.some(c => {
                const citaHora = new Date(c.fecha);
                const diffHoras = Math.abs((fecha.getTime() - citaHora.getTime()) / (1000 * 60 * 60));
                return diffHoras < .5; // Choque de menos de 1 hora
              });
              if (conflicto) {
                nuevosErrores.fechaVisita = "Ya existe una cita en este horario.";
              }
              setErrores(nuevosErrores);
              return Object.keys(nuevosErrores).length === 0;
            });
        }
      }
    }

    if (paso === 3) {
      if (!form.medioIngreso.trim()) nuevosErrores.medioIngreso = "Selecciona un medio de ingreso.";
      if (form.medioIngreso === "vehiculo") {
        if (!form.marca.trim()) nuevosErrores.marca = "La marca es obligatoria.";
        if (!form.modelo.trim()) nuevosErrores.modelo = "El modelo es obligatorio.";
      }
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
  };

  const limpiarCamposPaso = (numeroPaso: number) => {
    switch (numeroPaso) {
      case 1:
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
        setForm(prev => ({
          ...prev,
          fechaVisita: ""
        }));
        break;
      case 3:
        setForm(prev => ({
          ...prev,
          medioIngreso: "",
          marca: "",
          modelo: ""
        }));
        break;
    }
  };

  const siguientePaso = async () => {
    setTocado(true);
    const esValido = await validarPaso();
    if (esValido) {
      setTocado(false);
      if (paso < 3) {
        const siguientePasoNum = paso + 1;
        const datosActuales = {...form};
        limpiarCamposPaso(siguientePasoNum);
        setPaso(siguientePasoNum);
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
                fechaVisita: datosActuales.fechaVisita
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
      const datosActuales = {...form};
      limpiarCamposPaso(pasoAnteriorNum);
      setPaso(pasoAnteriorNum);
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
              fechaVisita: datosActuales.fechaVisita
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

  return {
    paso,
    setPaso,
    form,
    errores,
    tocado,
    exito,
    setExito,
    handleChange,
    siguientePaso,
    pasoAnterior,
    cancelar,
    handleSubmit
  };
}

function FormularioDatosPersonales({ form, errores, handleChange, tocado }: FormProps) {
  return (
    <motion.div
      key="paso1"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.5 }}
    >
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
              value={form[name as keyof FormData]} // Aquí indicamos que `name` es una clave de FormData
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {tocado && errores[name as keyof FormData] && ( // Usamos `name` con `keyof FormData`
              <span className="text-red-500 text-sm mt-1">{errores[name as keyof FormData]}</span>
            )}
          </div>
        ))}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Género</label>
          <select
            name="genero"
            value={form.genero}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selecciona un género</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro</option>
          </select>
          {tocado && errores.genero && (
            <span className="text-red-500 text-sm mt-1">{errores.genero}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
function FormularioDatosCita({ form, errores, handleChange, tocado }: FormProps) {
  return (
    <motion.div
      key="paso2"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col w-full max-w-md mx-auto">
        <label className="text-gray-600 mb-1">Fecha y horario</label>
        <input
          type="datetime-local"
          name="fechaVisita"
          value={form.fechaVisita}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {tocado && errores.fechaVisita && (
          <span className="text-red-500 text-sm mt-1">{errores.fechaVisita}</span>
        )}
      </div>
    </motion.div>
  );
}

function FormularioMedioIngreso({ form, errores, handleChange, tocado }: FormProps) {
  return (

    
    <motion.div
      key="paso3"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col md:col-span-2">
          <label className="text-gray-600 mb-1">Medio de ingreso</label>
          <select
            name="medioIngreso"
            value={form.medioIngreso}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selecciona medio de ingreso</option>
            <option value="PIE">PIE</option>
            <option value="CARRO">CARRO</option>
          </select>
          {tocado && errores.medioIngreso && (
            <span className="text-red-500 text-sm mt-1">{errores.medioIngreso}</span>
          )}
        </div>

        {form.medioIngreso === "CARRO" && (
          <>
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Marca del vehículo</label>
              <input
                type="text"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {tocado && errores.marca && (
                <span className="text-red-500 text-sm mt-1">{errores.marca}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Modelo del vehículo</label>
              <input
                type="text"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {tocado && errores.modelo && (
                <span className="text-red-500 text-sm mt-1">{errores.modelo}</span>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function Sidebar({
  rol,
  showHeader = false,
  headerTitle,
  headerDescription,
  children,
  mode,
}: SidebarProps) {
  const router = useRouter();
  const isAdmin = rol === "admin";
  const {
    paso,
    setPaso,
    form,
    errores,
    tocado,
    exito,
    setExito,
    handleChange,
    siguientePaso,
    pasoAnterior,
    cancelar,
    handleSubmit,
  } = useFormLogic();

  const [idAdmin, setIdAdmin] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("id");
    if (id) {
      setIdAdmin(Number(id));
      
    }
    if (!id) {
      router.push("/login");
    }
    const savedName = sessionStorage.getItem("nombre");
    if (savedName) {
      setNombre(savedName);
    }
  }, []);

  const enviarCita = async () => {
    const data = {
      fecha: form.fechaVisita,
      adminId: idAdmin,
      visitante: {
        nombre: form.nombre,
        genero: form.genero,
        fechaNac: form.nacimiento,
        ine: form.ine,
        correo: form.correo,
        celular: form.telefono,
      },
      medioIngreso: {
        forma_ingreso: form.medioIngreso,
      },
      vehiculo: form.medioIngreso === "CARRO" ? {
        marca: form.marca,
        modelo: form.modelo,
      } : null,
    };

    try {
      const response = await fetch("/api/sistema/postCita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setExito(true); // Muestra el mensaje de éxito
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("Error al registrar la cita. Intente nuevamente.");
    }
  };

  if (exito) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-gray-50">
        <nav className="bg-[#1E3A8A] shadow-xl px-10 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">
            {isAdmin ? "Panel de Guardia" : "Panel Universitario"}
          </h1>
          <button
            onClick={() => {router.push("/login"); sessionStorage.clear();}}
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
            <h2 className="text-2xl font-bold mb-3 text-[#1E3A8A]">
              ¡Registro exitoso!
            </h2>
            <p className="text-gray-600 mb-6">La cita ha sido registrada correctamente.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setExito(false);
                  cancelar();
                  setPaso(1);
                }}
                className="bg-[#1E3A8A] text-white px-6 py-3 rounded-xl shadow-md hover:brightness-110 transition flex items-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                Registrar otra cita
              </button>
              <button
                onClick={() => router.push("/Gestion/consultas")}
                className="bg-[#0A1E6A] text-white px-6 py-3 rounded-xl shadow-md hover:brightness-110 transition font-semibold flex items-center gap-2"
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

  return (
    <div className="flex flex-1 min-h-screen">
      <aside className="bg-[#1E3A8A] text-white w-64 flex flex-col justify-between py-8 px-6">
        <div>
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              👤
            </div>
            <p className="mt-3 font-semibold text-lg">
              Hola! {nombre}
            </p>
          </div>
          <nav className="flex flex-col gap-4">
            {!isAdmin && mode === "registro" && (
              <button
                onClick={() => setPaso(1)}
                className={`text-left py-2 px-4 rounded-lg flex items-center gap-2 ${
                  paso === 1 ? "bg-white/25" : "hover:bg-white/10"
                }`}
              >
                <FiPlus className="w-5 h-5" /> Registrar cita
              </button>
            )}
            <button
              onClick={() => router.push("/Gestion/consultas")}
              className="text-left py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-white/10"
            >
              <FiList className="w-5 h-5" /> Consultar cita
            </button>
          </nav>
        </div>

        <button
          onClick={() => {router.push("/login"); sessionStorage.clear();}}
          className="bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-all font-medium flex items-center gap-2"
        >
          <FiLogOut className="w-5 h-5" /> Salir
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-white p-10 rounded-tl-3xl shadow-inner overflow-y-auto">
          {showHeader && (
            <>
              <h1 className="text-2xl font-bold mb-2 text-[#1E3A8A]">{headerTitle}</h1>
              {headerDescription && (
                <p className="text-gray-500 mb-8">{headerDescription}</p>
              )}
            </>
          )}

          {mode === "registro" ? (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-8">
              <AnimatePresence mode="wait">
                {paso === 1 && (
                  <>
                    <h2 className="font-semibold text-lg mb-4 text-[#1E3A8A]">1 Datos personales</h2>
                    <FormularioDatosPersonales
                      form={form}
                      errores={errores}
                      handleChange={handleChange}
                      tocado={tocado}
                    />
                  </>
                )}

                {paso === 2 && (
                  <>
                    <h2 className="font-semibold text-lg mb-4 text-[#1E3A8A]">2 Datos de la cita</h2>
                    <FormularioDatosCita
                      form={form}
                      errores={errores}
                      handleChange={handleChange}
                      tocado={tocado}
                    />
                  </>
                )}

                {paso === 3 && (
                  <>
                    <h2 className="font-semibold text-lg mb-4 text-[#1E3A8A]">3 Medio de ingreso</h2>
                    <FormularioMedioIngreso
                      form={form}
                      errores={errores}
                      handleChange={handleChange}
                      tocado={tocado}
                    />
                  </>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-10">
                {paso > 1 ? (
                  <button
                    type="button"
                    onClick={pasoAnterior}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl shadow hover:bg-gray-300 transition font-semibold"
                  >
                    Anterior
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={cancelar}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl shadow hover:bg-gray-300 transition font-semibold"
                  >
                    Cancelar
                  </button>
                )}

                {paso < 3 ? (
                  <button
                    type="button"
                    onClick={siguientePaso}
                    className="bg-[#1E3A8A] text-white px-6 py-3 rounded-xl shadow-md hover:brightness-110 transition font-semibold"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={enviarCita}
                    className="bg-[#1E3A8A] text-white px-6 py-3 rounded-xl shadow-md hover:brightness-110 transition font-semibold"
                  >
                    Finalizar
                  </button>
                )}
              </div>
            </form>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export default Sidebar;
