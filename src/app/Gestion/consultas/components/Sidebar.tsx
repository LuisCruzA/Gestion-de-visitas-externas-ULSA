import { FiLogOut, FiList, FiPlus } from 'react-icons/fi';

interface SidebarProps {
  isAdmin: boolean;
  colorSidebar: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ isAdmin, colorSidebar, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className={`${colorSidebar} text-white w-64 flex flex-col justify-between py-8 px-6`}>
      <div>
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-2xl shadow-inner">
            👤
          </div>
          <p className="mt-3 font-semibold text-lg text-white">
            {!isAdmin ? "Guardia" : "Administrativo"}
          </p>
        </div>
        <nav className="flex flex-col gap-4">
          {isAdmin && (
            <button
              onClick={() => onNavigate("/Gestion/registro")}
              className="text-left py-2 px-4 rounded-lg flex items-center gap-2 text-white hover:bg-white/20 transition-all"
            >
              <FiPlus className="w-5 h-5" /> Registrar cita
            </button>
          )}
          <button
            onClick={() => onNavigate("/Gestion/consultas")}
            className="text-left py-2 px-4 rounded-lg flex items-center gap-2 bg-white/20 text-white font-medium"
          >
            <FiList className="w-5 h-5" /> Consultar cita
          </button>
        </nav>
      </div>
      <button
        onClick={onLogout}
        className="bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-all font-medium flex items-center gap-2 shadow-md"
      >
        <FiLogOut className="w-5 h-5" /> Salir
      </button>
    </aside>
  );
}
