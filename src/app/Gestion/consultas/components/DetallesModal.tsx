// DetallesModal.tsx
import { FiX } from 'react-icons/fi';
import { Cita } from './CitasTable';
import jsPDF from 'jspdf';

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

  // Función para generar el PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Añadir título
    doc.setFontSize(18);
    doc.text('Detalles de la Cita', 14, 20);

    // Detalles de la cita
    doc.setFontSize(12);
    doc.text(`Visitante: ${cita?.visitante.nombre}`, 14, 30);
    doc.text(`Correo: ${cita?.visitante.correo}`, 14, 40);
    doc.text(`Teléfono: ${cita?.visitante.celular}`, 14, 50);
    doc.text(`Fecha de Nacimiento: ${cita?.visitante.fechaNac}`, 14, 60);
    doc.text(`INE: ${cita?.visitante.ine}`, 14, 70);
    doc.text(`Fecha de la cita: ${cita?.fecha}`, 14, 80);
    doc.text(`Persona Visitada: ${cita?.personaVisitada || 'N/A'}`, 14, 90);
    doc.text(`Área: ${cita?.area || 'N/A'}`, 14, 100);
    doc.text(`Ingreso: ${cita?.visitante.medioIngresos?.[0]?.forma_ingreso || '—'}`, 14, 110);

    if (cita?.visitante.medioIngresos?.[0]?.vehiculo) {
      doc.text('Vehículo:', 14, 120);
      doc.text(`Modelo: ${cita?.visitante.medioIngresos[0].vehiculo?.modelo || 'N/A'}`, 14, 130);
      doc.text(`Marca: ${cita?.visitante.medioIngresos[0].vehiculo?.marca || 'N/A'}`, 14, 140);
      doc.text(`Color: ${cita?.visitante.medioIngresos[0].vehiculo?.color || 'N/A'}`, 14, 150);
      doc.text(`Placas: ${cita?.visitante.medioIngresos[0].vehiculo?.placas || 'N/A'}`, 14, 160);
    }

    // Descargar el PDF
    doc.save('detalles_cita.pdf');
  };

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

          {/* Botón para descargar el PDF */}
          <button
            onClick={downloadPDF}
            className="ml-4 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
