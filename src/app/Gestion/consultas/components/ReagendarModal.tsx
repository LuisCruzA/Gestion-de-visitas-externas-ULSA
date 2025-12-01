import { FiX } from 'react-icons/fi';
import { Cita } from './CitasTable';

interface ReagendarModalProps {
  isOpen: boolean;
  cita: Cita | null;
  nuevaFechaHora: { fecha: string; hora: string };
  error: string;
  colorBtn: string;
  onClose: () => void;
  onSave: () => void;
  onFechaChange: (fecha: string) => void;
  onHoraChange: (hora: string) => void;
  setError?: (msg: string) => void;
}

export default function ReagendarModal({
  isOpen,
  cita,
  nuevaFechaHora,
  error,
  colorBtn,
  onClose,
  onSave,
  onFechaChange,
  onHoraChange,
  setError
}: ReagendarModalProps) {
  if (!isOpen) return null;

  // -------------------------------
  // 🔥 VALIDACIONES DE FECHA Y HORA
  // -------------------------------
  const validarFechaYHora = () => {
    if (!nuevaFechaHora.fecha || !nuevaFechaHora.hora) {
      alert("Selecciona una fecha y hora.");
      return false;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaSeleccionada = new Date(`${nuevaFechaHora.fecha}T00:00`);
    const dia = fechaSeleccionada.getDay(); // 0 = Domingo, 6 = Sábado

    // ❌ No permitir fechas anteriores
    if (fechaSeleccionada < hoy) {
      // setError?.("No puedes seleccionar una fecha anterior a hoy.");
       alert("No puedes seleccionar una fecha anterior a hoy.");
      return false;
    }

    // ❌ No permitir domingos
    if (dia === 0) {
       alert("Los domingos no hay citas disponibles.");
      return false;
    }

    // ⛔ Validar horarios
    const [hora, minutos] = nuevaFechaHora.hora.split(":").map(Number);


    // SÁBADO
    if (dia === 6) {
      if (hora < 8 || (hora >= 16)) {
         alert("Los sábados el horario es de 8:00 AM a 4:00 PM.");
        return false;
      }
    } else {
      // ENTRE SEMANA (L–V)
      if (hora < 8 || hora >= 20) {
        alert("El horario entre semana es de 8:00 AM a 8:00 PM.");
        return false;
      }
    }

    return true;
  };

  // Ejecutar validación antes del onSave real
  const handleGuardar = () => {
    if (validarFechaYHora()) {
      onSave(); // si pasa, ejecuta la función original
    }
  };

  // -------------------------------
  // 🔥 RENDER DEL MODAL
  // -------------------------------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Reagendar Cita</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Visitante:</strong> {cita?.visitante.nombre}
          </p>
          <p className="text-sm text-gray-600 mb-3">
            <strong>Fecha actual:</strong> {cita?.fecha}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-3">
              <p className="text-sm font-semibold text-red-700 flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Fecha
            </label>
            <input
              type="date"
              value={nuevaFechaHora.fecha}
              onChange={(e) => onFechaChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
            />
          </div>

          {/* Hora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Hora
            </label>
            <input
              type="time"
              value={nuevaFechaHora.hora}
              onChange={(e) => onHoraChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
            />
            <p className="text-xs text-gray-500 mt-1">
              * Entre semana: 8:00 AM – 8:00 PM  
              * Sábado: 8:00 AM – 4:00 PM  
              * Domingo no disponible
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className={`flex-1 px-4 py-2.5 ${colorBtn} rounded-lg font-medium hover:opacity-90 transition`}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
