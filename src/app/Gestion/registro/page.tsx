"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../components/sidebar";

export default function RegistroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rol, setRol] = useState<string>("externo");

  // ✅ Carga segura del rol sin error de cascada
  useEffect(() => {
    if (typeof window === "undefined") return;
    const rolUrl = searchParams.get("rol");
    const saved = localStorage.getItem("rol");
    
    // Si el rol es admin (guardia), redirigir a consultas
    if (rolUrl === "admin" || (!rolUrl && saved === "admin")) {
      router.push("/Gestion/consultas?rol=admin");
      return;
    }

    if (rolUrl && rolUrl !== rol) {
      setTimeout(() => {
        setRol(rolUrl);
        localStorage.setItem("rol", rolUrl);
      }, 0);
    } else if (!rolUrl && saved && saved !== rol) {
      setTimeout(() => setRol(saved), 0);
    }
  }, [searchParams, router, rol]);

  return (
    <div className="min-h-screen">
      <Sidebar 
        rol={rol}
        mode="registro"
        showHeader={true}
        headerTitle="Registrar nueva visita"
        headerDescription="Ingresa los datos correspondientes para registrar una cita."
      />
    </div>
  );
}
