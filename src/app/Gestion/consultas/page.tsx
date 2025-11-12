"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiDownload } from 'react-icons/fi';
import Sidebar from "./components/Sidebar";
import FilterSection from "./components/FilterSection";
import CitasTable, { Cita } from "./components/CitasTable";
import ReagendarModal from "./components/ReagendarModal";
import { filtrarCitas } from "./components/FilterSection";

export default function ConsultasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rol, setRol] = useState("externo");

  const [citas, setCitas] = useState<Cita[]>([
    {
      id: 1,
      fecha: "2025-11-10 10:00",
      visitante: "Juan Pérez García",
      correo: "juan.perez@example.com",
      telefono: "5551234567",
      medioIngreso: "Vehículo",
      genero: "Masculino",
      estado: "Finalizada",
      area: "Servicios Escolares",
      placas: "ABC-123",
      modelo: "Toyota Corolla 2020"
    },
    {
      id: 2,
      fecha: "2025-11-15 14:30",
      visitante: "María López Hernández",
      correo: "maria.lopez@example.com",
      telefono: "5559876543",
      medioIngreso: "A pie",
      genero: "Femenino",
      estado: "Activa",
      area: "Deportes"
    },
    {
      id: 3,
      fecha: "2025-11-18 09:00",
      visitante: "Carlos Ramírez Torres",
      correo: "carlos.ramirez@example.com",
      telefono: "5551112233",
      medioIngreso: "Vehículo",
      genero: "Masculino",
      estado: "Activa",
      area: "Talleres",
      placas: "XYZ-789",
      modelo: "Honda Civic 2019"
    },
    {
      id: 4,
      fecha: "2025-11-11 15:00",
      visitante: "Ana Martínez Sánchez",
      correo: "ana.martinez@example.com",
      telefono: "5554445566",
      medioIngreso: "A pie",
      genero: "Femenino",
      estado: "Finalizada",
      area: "Coordinación"
    },
    {
      id: 5,
      fecha: "2025-11-09 11:30",
      visitante: "Luis González Pérez",
      correo: "luis.gonzalez@example.com",
      telefono: "5557778899",
      medioIngreso: "Vehículo",
      genero: "Masculino",
      estado: "Finalizada",
      area: "Deportes",
      placas: "DEF-456",
      modelo: "Nissan Sentra 2021"
    },
    {
      id: 6,
      fecha: "2025-11-20 16:00",
      visitante: "Patricia Hernández López",
      correo: "patricia.hernandez@example.com",
      telefono: "5552223344",
      medioIngreso: "A pie",
      genero: "Femenino",
      estado: "Activa",
      area: "Formación de la Fe"
    },
    {
      id: 7,
      fecha: "2025-11-25 08:30",
      visitante: "Roberto Silva Gómez",
      correo: "roberto.silva@example.com",
      telefono: "5556667788",
      medioIngreso: "Vehículo",
      genero: "Masculino",
      estado: "Activa",
      area: "Servicios Escolares",
      placas: "GHI-321",
      modelo: "Mazda 3 2022"
    },
    {
      id: 8,
      fecha: "2025-11-08 13:00",
      visitante: "Sofía Morales Castro",
      correo: "sofia.morales@example.com",
      telefono: "5559990011",
      medioIngreso: "A pie",
      genero: "Femenino",
      estado: "Finalizada",
      area: "Dirección Académica"
    }
  ]);

  useEffect(() => {
    const rolUrl = searchParams.get("rol");
    const saved = localStorage.getItem("rol");
    
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
  const colorSidebar = isAdmin ? "bg-[#916A00] text-white" : "bg-[#0A1E6A] text-white";
  const colorBtn = isAdmin ? "bg-[#A67C00] text-white" : "bg-[#0A1E6A] text-white";
  const colorHeader = isAdmin ? 'bg-[#A67C00]' : 'bg-[#0A1E6A]';
  
  const go = (path: string) => router.push(`${path}?rol=${rol}`);

  const [filtros, setFiltros] = useState({
    fechaHora: "",
    medioIngreso: "",
    area: "",
    estado: "",
    visitante: ""
  });

  const [modalReagendar, setModalReagendar] = useState<{ isOpen: boolean; cita: Cita | null }>({
    isOpen: false,
    cita: null
  });

  const [nuevaFechaHora, setNuevaFechaHora] = useState({
    fecha: "",
    hora: ""
  });

  const [errorReagendamiento, setErrorReagendamiento] = useState<string>("");

  const abrirModalReagendar = (cita: Cita) => {
    setModalReagendar({ isOpen: true, cita });
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0];
    const [, hora] = cita.fecha.split(" ");
    setNuevaFechaHora({ fecha: fechaHoy, hora });
    setErrorReagendamiento("");
  };

  const cerrarModalReagendar = () => {
    setModalReagendar({ isOpen: false, cita: null });
    setNuevaFechaHora({ fecha: "", hora: "" });
    setErrorReagendamiento("");
  };

  const validarReagendamiento = (): string | null => {
    const { fecha, hora } = nuevaFechaHora;

    if (!fecha || !hora) {
      return "Debe seleccionar fecha y hora";
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(fecha);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
      return "No se puede reagendar en una fecha pasada";
    }

    const diaSemana = fechaSeleccionada.getDay();
    if (diaSemana === 0) {
      return "No se pueden reagendar citas los domingos";
    }

    const [horas] = hora.split(":").map(Number);
    if (horas < 7 || horas >= 21) {
      return "El horario debe estar entre 7:00 AM y 9:00 PM";
    }

    const fechaHoraCompleta = `${fecha} ${hora}`;
    const citaSolapada = citas.find(
      (c) => c.fecha === fechaHoraCompleta && c.id !== modalReagendar.cita?.id
    );

    if (citaSolapada) {
      return "Ya existe una cita programada en esta fecha y hora";
    }

    return null;
  };

  const guardarReagendamiento = () => {
    const error = validarReagendamiento();
    
    if (error) {
      setErrorReagendamiento(error);
      return;
    }

    // TODO: Implementar lógica para guardar el reagendamiento en la base de datos
    console.log("Reagendar cita:", modalReagendar.cita?.id, nuevaFechaHora);
    
    setCitas(citas.map(c => 
      c.id === modalReagendar.cita?.id 
        ? { ...c, fecha: `${nuevaFechaHora.fecha} ${nuevaFechaHora.hora}` }
        : c
    ));
    
    cerrarModalReagendar();
  };

  // Usar useMemo para calcular las citas filtradas
  const citasFiltradas = useMemo(() => {
    return filtrarCitas(citas, filtros);
  }, [citas, filtros]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        isAdmin={isAdmin}
        colorSidebar={colorSidebar}
        onNavigate={go}
        onLogout={() => router.push("/login")}
      />

      <main className="flex-1 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-3xl font-bold ${isAdmin ? "text-[#A67C00]" : "text-[#0A1E6A]"}`}>
              Consultar Citas
            </h2>
            <button
              onClick={() => {}}
              className={`${colorBtn} px-5 py-2.5 rounded-lg hover:opacity-90 transition font-semibold flex items-center gap-2 shadow-md`}
            >
              <FiDownload className="w-5 h-5" /> Descargar PDF
            </button>
          </div>

          <FilterSection
            isAdmin={isAdmin}
            filtros={filtros}
            onFiltrosChange={setFiltros}
          />

          <CitasTable
            citas={citasFiltradas}
            isAdmin={isAdmin}
            colorHeader={colorHeader}
            onReagendar={abrirModalReagendar}
          />
        </div>
      </main>

      <ReagendarModal
        isOpen={modalReagendar.isOpen}
        cita={modalReagendar.cita}
        nuevaFechaHora={nuevaFechaHora}
        error={errorReagendamiento}
        colorBtn={colorBtn}
        onClose={cerrarModalReagendar}
        onSave={guardarReagendamiento}
        onFechaChange={(fecha) => setNuevaFechaHora({ ...nuevaFechaHora, fecha })}
        onHoraChange={(hora) => setNuevaFechaHora({ ...nuevaFechaHora, hora })}
      />
    </div>
  );
}
