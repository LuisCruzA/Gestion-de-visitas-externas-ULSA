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
  // Título principal con fondo
doc.setFillColor(33, 150, 243); // Azul bonito
doc.rect(0, 0, 210, 30, 'F');   // Rectángulo de fondo
doc.setTextColor(255, 255, 255);
doc.setFontSize(22);
doc.text('Detalles de la Cita', 105, 18, { align: 'center' });

// Reset de colores
doc.setTextColor(0, 0, 0);

// Caja de información
doc.setFillColor(245, 245, 245); // Fondo gris clarito
doc.roundedRect(10, 40, 190, 140, 3, 3, 'F');

// Línea decorativa
doc.setDrawColor(33, 150, 243);
doc.setLineWidth(0.8);
doc.line(10, 38, 200, 38);

// Contenido dentro de la caja
let y = 55;
doc.setFontSize(13);
doc.setTextColor(40, 40, 40);

// Función para imprimir líneas con mejor espaciado
const write = (text: string | string[]) => {
  doc.text(text, 18, y);
  y += 10;
};

// Datos
write(`Visitante: ${cita?.visitante.nombre}`);
write(`Correo: ${cita?.visitante.correo}`);
write(`Teléfono: ${cita?.visitante.celular}`);
write(`Fecha de Nacimiento: ${cita?.visitante.fechaNac}`);
write(`INE: ${cita?.visitante.ine}`);
write(`Fecha de la cita: ${cita?.fecha}`);
write(`Persona Visitada: ${cita?.personaVisitada || 'N/A'}`);
write(`Área: ${cita?.area || 'N/A'}`);
write(`Ingreso: ${cita?.visitante.medioIngresos?.[0]?.forma_ingreso || '—'}`);

if (cita?.visitante.medioIngresos?.[0]?.vehiculo) {
  y += 5;
  doc.setFontSize(14);
  doc.setTextColor(33, 150, 243);
  doc.text("Vehículo:", 18, y);
  y += 8;

  doc.setFontSize(13);
  doc.setTextColor(40, 40, 40);
  write(`Modelo: ${cita?.visitante.medioIngresos[0].vehiculo?.modelo || 'N/A'}`);
  write(`Marca: ${cita?.visitante.medioIngresos[0].vehiculo?.marca || 'N/A'}`);
  write(`Color: ${cita?.visitante.medioIngresos[0].vehiculo?.color || 'N/A'}`);
  write(`Placas: ${cita?.visitante.medioIngresos[0].vehiculo?.placas || 'N/A'}`);
}

write('Universidad La Salle - Sistema de Gestión de Visitas')


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
