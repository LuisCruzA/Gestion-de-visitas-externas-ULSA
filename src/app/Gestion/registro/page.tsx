"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../components/sidebar";

export default function RegistroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [id, setId] = useState<Number>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const idUser = Number(searchParams.get("id"));
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdmin);
    
    if (!isAdmin) {
      router.push("/Gestion/consultas?rol=admin");
      return;
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Sidebar 
        isAdmin={isAdmin}
        mode="registro"
        showHeader={true}
        headerTitle="Registrar nueva visita"
        headerDescription="Ingresa los datos correspondientes para registrar una cita."
      />
    </div>
  );
}
