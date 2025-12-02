"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut, FiList, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence, } from "framer-motion";
import Swal from "sweetalert2";


// Formulario y lógica del formulario
interface FormData {
  nombre: string;
  ine: string;
  genero: string;
  correo: string;
  nacimiento: string;
  telefono: string;
  fechaVisita: string;
  personaVisita?: string;
  area?: string;
  medioIngreso: string;
  marca: string;
  modelo: string;
  placas?:string;
  color?: string;
  conoces?:string;
}


interface FormProps {
  form: FormData;
  errores: { [key in keyof FormData]?: string }; // Ahora, los errores tienen claves de FormData
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  tocado: boolean;
  usuarioExistente?: any;
}
interface SidebarProps {
  isAdmin: boolean;
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
    color:"",
    placas:""

  });
  const [errores, setErrores] = useState<{[key: string]: string}>({});
  const [tocado, setTocado] = useState(false);
  const [exito, setExito] = useState(false);

  const [usuarioExistente, setUsuarioExistente] = useState<any>(null);

useEffect(() => {
  if (form.ine.length >= 8 && form.correo.includes('@')) {
    const timer = setTimeout(() => {
      verificarUsuarioExistente(form.ine, form.correo);
    }, 800); // Debounce de 800ms
    
    return () => clearTimeout(timer);
  }
}, [form.ine, form.correo]);

  const verificarUsuarioExistente = async (ine: string, correo: string) => {
    try {
      const response = await fetch(`/api/visitantes/verificar?ine=${ine}&correo=${correo}`);
      const data = await response.json();
      
      if (data.error === "CONFLICTO") {
        const confirmar = window.confirm(
          ` ${data.mensaje}\n\n` +
          `INE: ${ine}\n` +
          `Correo: ${correo}\n\n` +
          `¿Deseas continuar con el registro como nuevo usuario?`
        );
        
        if (!confirmar) {
          return false;
        }
        setUsuarioExistente(null);
        return false;
      }
      
      if (data.existe) {
        setUsuarioExistente(data.visitante);
        
        const fechaNacimiento = data.visitante.fechaNac 
          ? new Date(data.visitante.fechaNac).toISOString().split('T')[0]
          : "";
        
        setForm(prev => ({
          ...prev,
          nombre: data.visitante.nombre,
          genero: data.visitante.genero,
          nacimiento: fechaNacimiento,
          telefono: data.visitante.celular,
          correo: data.visitante.correo,
          ine: data.visitante.ine,
        }));
        
        // ✅ Mostrar qué coincidió
        if (data.coincidencias.ine && data.coincidencias.correo) {
          Swal.fire({
            title: "Usuario encontrado",
            text: "INE y correo coinciden",
            icon: "success",
          });
        } else if (data.coincidencias.ine) {
          Swal.fire({
            title: "Usuario encontrado por INE.",
            text: "",
            icon: "info",
          });
        } else if (data.coincidencias.correo) {
          Swal.fire({
            title: "Usuario encontrado",
            text: "Usuario encontrado por correo. Verifica que el INE sea correcto.",
            icon: "info",
          });
        }
        
        return true;
      }
      
      setUsuarioExistente(null);
      return false;
    } catch (error) {
      console.error("Error al verificar usuario:", error);
      return false;
    }
  };

  useEffect(() => {
      const idadmin = sessionStorage.getItem("id");

      if (idadmin) {
        setIdAdmin(Number(idadmin));
      }
    }, []);

  const validarPaso = async () => {
    const nuevosErrores: {[key: string]: string} = {};
    if (paso === 1) {
      if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
      if (!form.ine.trim()) nuevosErrores.ine = "El INE es obligatorio.";
      if (!form.genero.trim()) nuevosErrores.genero = "El género es obligatorio.";
      if (!form.correo.trim()) nuevosErrores.correo = "El correo es obligatorio.";
      if (!form.nacimiento.trim()) {
        nuevosErrores.nacimiento = "La fecha de nacimiento es obligatoria.";
      } else {
        if (form.ine.trim() && form.correo.trim()) {
          const existe = await verificarUsuarioExistente(form.ine, form.correo);
        }

        // 🧠 Validar que tenga al menos 15 años
        const fechaNacimiento = new Date(form.nacimiento);
        const hoy = new Date();

        const edad =
          hoy.getFullYear() -
          fechaNacimiento.getFullYear() -
          (hoy < new Date(hoy.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate()) ? 1 : 0);

        if (edad < 18) {
          nuevosErrores.nacimiento = "Debes tener al menos 18 años para continuar.";
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
      if (!form.area || form.area.trim() === "" || form.area === "Otro") {
        nuevosErrores.area = "Debes seleccionar o especificar un área.";
      }

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
        const arr:number[] = [1,2,3,4,5];

        if (dia === 0) {
          nuevosErrores.fechaVisita = "No se pueden agendar citas en domingo.";
        } else if (dia === 6 && (hora > 16 || (hora === 16 && minutos > 0))) {
          nuevosErrores.fechaVisita = "Los sábados solo se pueden agendar citas hasta las 4:00 PM.";
        }
        else if(arr.includes(dia) && (hora >20 ||(hora === 20 && minutos> 0)) || (hora < 8 || (hora===8 && minutos < 0)))
          {
            nuevosErrores.fechaVisita = "Escoge una hora valida entre las 8 am y 8 pm";

        }


        // 🕒 Verificar disponibilidad de horario
        // Solo ejecutar si no hay errores hasta este punto
        if (Object.keys(nuevosErrores).length === 0) {
          // Esta validación será asíncrona
          return fetch(`/api/citas/list?fecha=${fecha.toISOString().split("T")[0]}&adminId=${idAdmin}`)
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
          fechaVisita: "",
          personaVisita:"",
          area:""
        }));
        break;
      case 3:
        setForm(prev => ({
          ...prev,
          medioIngreso: "",
          marca: "",
          modelo: "",
          placas:"",
          color:"",
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
                fechaVisita: datosActuales.fechaVisita,
                area: datosActuales.area,
                personaVisita: datosActuales.personaVisita
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
              fechaVisita: datosActuales.fechaVisita,
              area: datosActuales.area,
                personaVisita: datosActuales.personaVisita
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
      placas:"",
      color:""
    });
    setErrores({});
    setTocado(false);
    setUsuarioExistente(null);
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
    usuarioExistente,
    verificarUsuarioExistente,
    handleChange,
    siguientePaso,
    pasoAnterior,
    cancelar,
    handleSubmit
  };
}

function FormularioDatosPersonales({ form, errores, handleChange, tocado, usuarioExistente }: FormProps) {
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
          { name: "nombre", label: "Nombre completo", type: "text", disabled: !!usuarioExistente },
          { name: "ine", label: "INE", type: "text", disabled: !!usuarioExistente },
          { name: "correo", label: "Correo electrónico", type: "email", disabled: !!usuarioExistente },
          { name: "nacimiento", label: "Fecha de nacimiento", type: "date", disabled: !!usuarioExistente },
          { name: "telefono", label: "Número celular", type: "text", disabled: false },

        ].map(({ name, label, type, disabled }) => (
          <div key={name} className="flex flex-col">
            <label className="text-gray-600 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name as keyof FormData]}
              onChange={handleChange}
              disabled={disabled}
              className={`border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'
              }`}
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
  const areas = [
    "Rectoría",
    "Dirección General",
    "Recursos Humanos",
    "Finanzas",
    "Servicios Escolares",
    "Biblioteca Central",
    "Biblioteca de Ingeniería",
    "Laboratorio de Química",
    "Laboratorio de Física",
    "Laboratorio de Computación",
    "Centro de Cómputo",
    "Deportes",
    "Cafetería Principal",
    "Cafetería Norte",
    "Mantenimiento",
    "Sistemas",
    "Auditorio Principal",
    "Sala de Juntas A",
    "Sala de Juntas B",
    "Departamento de Contabilidad",
    "Departamento de Marketing",
    "Secretaría Académica",
    "Servicios Escolares",,
    "Talleres",
    "Coordinación",
    "Deportes",
    "Formación de la Fe",
    "Dirección Académica",
    // Agrega todas las que necesites...
  ];

  const [busquedaArea, setBusquedaArea] = useState("");
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [areasFiltradas, setAreasFiltradas] = useState<string[]>([]);

  // Filtrar áreas mientras escribe
  useEffect(() => {
    if (busquedaArea.trim() === "") {
      setAreasFiltradas([]);
      setMostrarSugerencias(false);
    } else {
      const filtradas = areas.filter(area =>
        area.toLowerCase().includes(busquedaArea.toLowerCase())
      );
      setAreasFiltradas(filtradas);
      setMostrarSugerencias(true);
    }
  }, [busquedaArea]);

  const seleccionarArea = (area: string) => {
    setBusquedaArea(area);
    const event = {
      target: {
        name: "area",
        value: area
      }
    } as any;
    handleChange(event);
    setMostrarSugerencias(false);
  };

  return (
    <motion.div
      key="paso2"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Fecha y horario */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-2">
          Fecha y horario de la visita
        </label>
        <input
          type="datetime-local"
          name="fechaVisita"
          value={form.fechaVisita}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        {tocado && errores.fechaVisita && (
          <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
            {errores.fechaVisita}
          </span>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Horario: Lun-Vie 8:00-20:00 | Sáb 8:00-16:00
        </p>
      </div>

      {/* Autocomplete de Área */}
      <div className="flex flex-col relative">
        <label className="text-gray-700 font-medium mb-2">
          ¿A qué área te diriges?
        </label>
        <input
          type="text"
          value={busquedaArea}
          onChange={(e) => setBusquedaArea(e.target.value)}
          onFocus={() => busquedaArea && setMostrarSugerencias(true)}
          placeholder="Escribe para buscar un área..."
          className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        
        {/* Dropdown de sugerencias */}
        {mostrarSugerencias && areasFiltradas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10"
          >
            {areasFiltradas.map((area, index) => (
              <button
                key={index}
                type="button"
                onClick={() => seleccionarArea(area)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-800">{area}</span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Mensaje si no hay resultados */}
        {mostrarSugerencias && busquedaArea && areasFiltradas.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10"
          >
            <p className="text-gray-500 text-sm">
              No se encontraron áreas. Escribe el nombre manualmente.
            </p>
          </motion.div>
        )}

        {/* Mostrar área seleccionada */}
        {form.area && !mostrarSugerencias && (
          <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
            ✓ Área seleccionada: <strong>{form.area}</strong>
            <button
              type="button"
              onClick={() => {
                setBusquedaArea("");
                const event = {
                  target: { name: "area", value: "" }
                } as any;
                handleChange(event);
              }}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {tocado && errores.area && (
          <span className="text-red-500 text-sm mt-1">⚠️ {errores.area}</span>
        )}
        
        <p className="text-xs text-gray-500 mt-1">
          Si no encuentras el área, escríbela manualmente
        </p>
      </div>

      {/* Persona a visitar (opcional) */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-2">
          Persona a visitar <span className="text-gray-400 text-sm">(Opcional)</span>
        </label>
        <input
          type="text"
          name="personaVisita"
          value={form.personaVisita || ""}
          onChange={handleChange}
          placeholder="Nombre de la persona (si aplica)"
          className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <p className="text-xs text-gray-500 mt-1">
          Si no sabes a quién visitar específicamente, déjalo en blanco
        </p>
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
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Placas del vehículo</label>
              <input
                type="text"
                name="placas"
                value={form.placas}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {tocado && errores.placas && (
                <span className="text-red-500 text-sm mt-1">{errores.placas}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Color del vehículo</label>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {tocado && errores.color && (
                <span className="text-red-500 text-sm mt-1">{errores.color}</span>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function Sidebar({
  isAdmin,
  showHeader = false,
  headerTitle,
  headerDescription,
  children,
  mode,
}: SidebarProps) {
  const router = useRouter();
  const {
    paso,
    setPaso,
    form,
    errores,
    tocado,
    exito,
    setExito,
    usuarioExistente,
    verificarUsuarioExistente,
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
    console.log("Estado de form antes de enviar:", form);

    const data = {
      fecha: form.fechaVisita,
      adminId: idAdmin,
      visitante: usuarioExistente ? {
        id: usuarioExistente.id_visitante, // ✅ Enviar ID si existe
        nombre: form.nombre,
        genero: form.genero,
        fechaNac: form.nacimiento,
        celular: form.telefono,
      } : {
        // Crear nuevo visitante
        nombre: form.nombre,
        genero: form.genero,
        fechaNac: form.nacimiento,
        ine: form.ine,
        correo: form.correo,
        celular: form.telefono,
      },
      cita: {
        area: form.area,
        personaVisitada: form.personaVisita
      },
      medioIngreso: {
        forma_ingreso: form.medioIngreso,
      },
      vehiculo: form.medioIngreso === "CARRO" ? {
        marca: form.marca,
        modelo: form.modelo,
        placas: form.placas,
        color: form.color
      } : null,
    };
    console.log("Datos a enviar:", data); // Aquí verifica que `area` esté en `data`

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
            {!isAdmin ? "Panel de Guardia" : "Panel Universitario"}
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
            {isAdmin && mode === "registro" && (
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
                      usuarioExistente={usuarioExistente}
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
