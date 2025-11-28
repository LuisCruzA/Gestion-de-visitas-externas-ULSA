// DetallesModal.tsx
import { FiX } from 'react-icons/fi';
import { Cita } from './CitasTable';

interface DetallesModalProps {
  isOpen: boolean;
  cita: Cita | null;
  onClose: () => void;
}

export default function DetallesModal({
  isOpen,
  cita,
  onClose,
}: DetallesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Detalles de la Cita</h3>
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
          <p className="text-sm text-gray-600 mb-2">
            <strong>Correo:</strong> {cita?.visitante.correo}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Teléfono:</strong> {cita?.visitante.celular}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Fecha de Nacimiento:</strong> {cita?.visitante.fechaNac}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>INE:</strong> {cita?.visitante.ine}
          </p>
          <p className="text-sm text-gray-600 mb-3">
            <strong>Fecha de la cita:</strong> {cita?.fecha}
          </p>

          <p className="text-sm text-gray-600 mb-2">
            <strong>Persona Visitada:</strong> {cita?.personaVisitada || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Área:</strong> {cita?.area || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Ingreso:</strong> {cita?.visitante.medioIngresos?.[0]?.forma_ingreso || '—'}
          </p>

          {cita?.visitante.medioIngresos?.[0]?.vehiculo && (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Vehículo:</strong>
              </p>
              <p className="text-sm text-gray-600">
                <strong>Modelo:</strong> {cita?.visitante.medioIngresos[0].vehiculo?.modelo || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Marca:</strong> {cita?.visitante.medioIngresos[0].vehiculo?.marca || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Color:</strong> {cita?.visitante.medioIngresos[0].vehiculo?.color || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Placas:</strong> {cita?.visitante.medioIngresos[0].vehiculo?.placas || 'N/A'}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
