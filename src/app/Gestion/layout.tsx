import Link from "next/link";
import NavBar from "../components/navbar";

export default function CitasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar específico de Citas */}
      
        <NavBar></NavBar>

      {/* Contenido de cada página */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer opcional solo para citas */}
      <footer className="bg-gray-200 text-center p-4 mt-auto">
        © 2025 Sección Citas
      </footer>
    </div>
  );
}
