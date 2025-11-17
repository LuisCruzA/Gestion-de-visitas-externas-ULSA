import { FiCalendar } from 'react-icons/fi';

export interface Cita {
  id: number;
  fecha: string;
  visitante: string;
  correo: string;
  telefono: string;
  medioIngreso: string;
  genero: string;
  estado: string;
  area: string;
  placas?: string;
  modelo?: string;
}

interface CitasTableProps {
  citas: Cita[];
  isAdmin: boolean;
  colorHeader: string;
  onReagendar: (cita: Cita) => void;
}

export default function CitasTable({ citas, isAdmin, colorHeader, onReagendar }: CitasTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${colorHeader} text-white`}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Fecha y Hora</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Visitante</th>
              {isAdmin ? (
                <>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Área</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Placas/Modelo</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Correo</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Teléfono</th>
                </>
              )}
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Ingreso</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
              {!isAdmin && (
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {citas.map((cita, index) => (
              <tr key={cita.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cita.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cita.visitante}</td>
                {isAdmin ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cita.area}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {cita.medioIngreso === "Vehículo" ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{cita.placas || "N/A"}</span>
                          <span className="text-xs text-gray-500">{cita.modelo || "N/A"}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cita.correo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cita.telefono}</td>
                  </>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cita.medioIngreso}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    cita.estado === 'Activa' ? 'bg-blue-100 text-blue-800' : 
                    cita.estado === 'Finalizada' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {cita.estado}
                  </span>
                </td>
                {!isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {cita.estado === 'Activa' ? (
                      <button 
                        onClick={() => onReagendar(cita)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-2 font-medium text-sm shadow-sm"
                        title="Reagendar cita"
                      >
                        <FiCalendar className="w-4 h-4" />
                        Reagendar
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm italic">—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">{citas.length}</span> de <span className="font-medium">{citas.length}</span> resultados
        </div>
      </div>
    </div>
  );
}
