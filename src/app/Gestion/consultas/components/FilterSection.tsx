import { FiSearch } from 'react-icons/fi';
import { Cita } from './CitasTable';

interface Filtros {
  fechaHora: string;
  medioIngreso: string;
  area: string;
  estado: string;
  visitante: string;
}

interface FilterSectionProps {
  isAdmin: boolean;
  filtros: Filtros;
  onFiltrosChange: (filtros: Filtros) => void;
}

// Función para filtrar las citas
export const filtrarCitas = (citas: Cita[], filtros: Filtros): Cita[] => {
  return citas.filter(cita => {
    // Filtro por visitante (búsqueda por texto)
    if (filtros.visitante && !cita.visitante.toLowerCase().includes(filtros.visitante.toLowerCase())) {
      return false;
    }

    // Filtro por fecha y hora
    if (filtros.fechaHora) {
      // Convertir el formato de datetime-local (YYYY-MM-DDTHH:mm) al formato de la cita (YYYY-MM-DD HH:mm)
      const fechaHoraFiltro = filtros.fechaHora.replace('T', ' ');
      if (cita.fecha !== fechaHoraFiltro) {
        return false;
      }
    }

    // Filtro por medio de ingreso
    if (filtros.medioIngreso && cita.medioIngreso !== filtros.medioIngreso) {
      return false;
    }

    // Filtro por estado
    if (filtros.estado && cita.estado !== filtros.estado) {
      return false;
    }

    // Filtro por área
    if (filtros.area && cita.area !== filtros.area) {
      return false;
    }

    return true;
  });
};

export default function FilterSection({ isAdmin, filtros, onFiltrosChange }: FilterSectionProps) {
  const handleChange = (key: keyof Filtros, value: string) => {
    onFiltrosChange({ ...filtros, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Filtros de búsqueda</h3>
        <div className="flex-1 max-w-md ml-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar visitante..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              value={filtros.visitante}
              onChange={(e) => handleChange('visitante', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={`grid ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-2">Fecha y hora</label>
          <input
            type="datetime-local"
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={filtros.fechaHora}
            onChange={(e) => handleChange('fechaHora', e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-2">Medio de ingreso</label>
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
            value={filtros.medioIngreso}
            onChange={(e) => handleChange('medioIngreso', e.target.value)}
          >
              <option value="">Todos</option>
              <option value="Vehículo">Vehículo</option>
              <option value="A pie">A pie</option>
          </select>
        </div>
        {isAdmin && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Área</label>
            <select
              className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
              value={filtros.area}
              onChange={(e) => handleChange('area', e.target.value)}
            >
              <option value="">Todas</option>
              <option value="Servicios Escolares">Servicios Escolares</option>
              <option value="Talleres">Talleres</option>
              <option value="Coordinación">Coordinación</option>
              <option value="Deportes">Deportes</option>
              <option value="Formación de la Fe">Formación de la Fe</option>
              <option value="Dirección Académica">Dirección Académica</option>
            </select>
          </div>
        )}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-2">Estado</label>
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
            value={filtros.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
          >
            <option value="">Todas</option>
            <option value="Activa">Activa</option>
            <option value="Finalizada">Finalizada</option>
          </select>
        </div>
      </div>
    </div>
  );
}
