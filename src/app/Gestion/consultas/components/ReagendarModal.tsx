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
  onHoraChange
}: ReagendarModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
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
          {/* Información del visitante */}
          <p className="text-sm text-gray-600 mb-2">
            <strong>Visitante:</strong> {cita?.visitante.nombre}
          </p>
          <p className="text-sm text-gray-600 mb-3">
            <strong>Fecha actual:</strong> {cita?.fecha}
          </p>
          
          {/* Mensaje de error */}
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
          {/* Selector de fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Fecha
            </label>
            <input
              type="date"
              value={nuevaFechaHora.fecha}
              onChange={(e) => onFechaChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
              style={{ colorScheme: 'light' }}
            />
          </div>

          {/* Selector de hora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Hora
            </label>
            <input
              type="time"
              min="07:00"
              max="21:00"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
              style={{ colorScheme: 'light' }}
              value={nuevaFechaHora.hora}
              onChange={(e) => onHoraChange(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Horario disponible: 7:00 AM - 9:00 PM</p>
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
            onClick={onSave}
            className={`flex-1 px-4 py-2.5 ${colorBtn} rounded-lg font-medium hover:opacity-90 transition`}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
