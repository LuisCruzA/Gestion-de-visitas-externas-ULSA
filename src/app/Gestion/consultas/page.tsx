'use client'
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiDownload } from "react-icons/fi";
import Sidebar from "./components/Sidebar";
import FilterSection from "./components/FilterSection";
import CitasTable, { Cita } from "./components/CitasTable";
import ReagendarModal from "./components/ReagendarModal";
import { filtrarCitas } from "./components/FilterSection";

export default function ConsultasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rol, setRol] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [citas, setCitas] = useState<Cita[]>([]);

  const [adminId, setAdminId] = useState<string | null>(null);

  
  useEffect(() => {
    // Verifica si estamos en el entorno del cliente
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
    if (typeof window !== "undefined") {
      // Accede a sessionStorage solo en el cliente
      const id = sessionStorage.getItem("id");
      if (id) {
        setAdminId(id); // Establece el adminId desde sessionStorage
        fetchCitas(id);
      }
    }
    setIsAdmin(isAdmin);

  }, []);

  // Definir la función fetchCitas aquí
  const fetchCitas = async (adminId: string) => {
    try {
      const response = await fetch("/api/getCitas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "adminId": adminId, // Pasar el adminId en los headers
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCitas(data); // Establecer las citas en el estado
      } else {
        console.error("Error al obtener citas:", data.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  // 🔄 Auto-refresh cada 30 segundos
useEffect(() => {
  if (!adminId) return;

  const interval = setInterval(() => {
    fetchCitas(adminId); // vuelve a pedir al backend
  }, 30000); // 30 segundos

  return () => clearInterval(interval); // limpiar
}, [adminId]);

const handleReagendarSuccess = () => {
  if (adminId) {
    fetchCitas(adminId);
  }
};
  const colorSidebar = !isAdmin ? "bg-[#916A00] text-white" : "bg-[#0A1E6A] text-white";
  const colorBtn = !isAdmin ? "bg-[#A67C00] text-white" : "bg-[#0A1E6A] text-white";
  const colorHeader = !isAdmin ? 'bg-[#A67C00]' : 'bg-[#0A1E6A]';

  const go = (path: string) => router.push(`${path}?id=${adminId}`);

  const [filtros, setFiltros] = useState({
    fechaHora: "",
    medioIngreso: "",
    area: "",
    estado: "",
    visitante: ""
  });

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
            <h2 className={`text-3xl font-bold ${!isAdmin ? "text-[#A67C00]" : "text-[#0A1E6A]"}`}>
              Consultar Citas
            </h2>
            {/* <button
              onClick={() => {}}
              className={`${colorBtn} px-5 py-2.5 rounded-lg hover:opacity-90 transition font-semibold flex items-center gap-2 shadow-md`}
            >
              <FiDownload className="w-5 h-5" /> Descargar PDF
            </button> */}
          </div>

          <FilterSection
            isAdmin={isAdmin}
            filtros={filtros}
            onFiltrosChange={setFiltros}
          />

          <CitasTable
            citas={citasFiltradas}
            setCitas={setCitas}
            isAdmin={isAdmin}
            colorHeader={colorHeader}
            onReagendar={handleReagendarSuccess}
          />
        </div>
      </main>

      <ReagendarModal
        isOpen={false}
        cita={null}
        nuevaFechaHora={{ fecha: "", hora: "" }}
        error=""
        colorBtn={colorBtn}
        onClose={() => {}}
        onSave={() => {}}
        onFechaChange={() => {}}
        onHoraChange={() => {}}
      />
    </div>
  );
}
