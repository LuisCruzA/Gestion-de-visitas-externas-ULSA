import { FiCalendar, FiX, FiEye } from 'react-icons/fi';
import ReagendarModal from './ReagendarModal';
import { useState } from 'react';
import DetallesModal from './DetallesModal';
import Swal from 'sweetalert2';

export interface Cita {
  adminId: number;
  id_cita: number;
  fecha: string;
  area: string | null;
  estado: string;
  personaVisitada:string;
  visitante: {
    nombre: string;
    correo: string;
    celular: string;
    genero: string;
    fechaNac:string;
    ine:string;
    medioIngresos: {
      forma_ingreso: "PIE" | "CARRO";
      vehiculo?: {
        placas: string;
        modelo: string;
        marca:string;
        color:string;
      } | null;
    }[];
  };
}

interface CitasTableProps {
  citas: Cita[];
  setCitas: React.Dispatch<React.SetStateAction<Cita[]>>;
  isAdmin: boolean;
  colorHeader: string;
  onReagendar: (cita: Cita) => void;
}

export default function CitasTable({
  citas,
  setCitas,
  isAdmin,
  colorHeader,
  onReagendar,
}: CitasTableProps) {
  // Estado para el modal
  const [isOpen, setOpen] = useState(false);
  const [isDetallesOpen, setDetallesOpen] = useState(false); // Estado para abrir el modal de detalles
  const [isCancelOpen, setCancelOpen] = useState(false);

  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [nuevaFechaHora, setNuevaFechaHora] = useState({ fecha: '', hora: '' });
  const [error, setError] = useState('');
  const [colorBtn, setColorBtn] = useState('bg-blue-600');

  const handleFechaChange = (fecha: string) => {
    setNuevaFechaHora((prev) => ({ ...prev, fecha }));
  };

  const handleHoraChange = (hora: string) => {
    setNuevaFechaHora((prev) => ({ ...prev, hora }));
  };

  const handleSave = async () => {
    if (!nuevaFechaHora.fecha || !nuevaFechaHora.hora) {
      setError("Selecciona fecha y hora válidas");
      return;
    }
  
    if (!citaSeleccionada) return;

    try {
      const resp = await fetch(`/api/citas/${citaSeleccionada?.id_cita}/reagendar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: nuevaFechaHora.fecha,
          hora: nuevaFechaHora.hora
        }),
      });
  
      const data = await resp.json();
  
      if (!resp.ok) {
        setError(data.error || "No se pudo reagendar");
        return;
      }
  
      Swal.fire({
        icon: "success",
        title: "Cita reagendada",
        text: "La cita se actualizó correctamente.",
      });
  
      setOpen(false);
      setError("");
  
      // REFRESCAR la pantalla
      // setCitas(prev => prev.filter(c => c.id_cita !== cita.id_cita));
      onReagendar(citaSeleccionada);
  
    } catch (err) {
      console.error(err);
      setError("Error al guardar los cambios");
    }
  };
  

  const handleOpenModal = (cita: Cita) => {
    setCitaSeleccionada(cita);
    const [soloFecha, soloHora] = cita.fecha.split(" ");

    setNuevaFechaHora({
      fecha: soloFecha, 
      hora: soloHora?.slice(0,5) || "12:00"
    });
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleOpenDetallesModal = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setDetallesOpen(true);
  };

  const handleCloseDetallesModal = () => {
    setDetallesOpen(false);
  };

  const handleCancelCita = async (cita: Cita) => {
    setCitaSeleccionada(cita);
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la cita por completo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar cita',
      cancelButtonText: 'No, mantener',
    }).then(async (result) => {
      if (result.isConfirmed) {
  
        try {
          // Llamada a la API DELETE
          const resp = await fetch(`/api/citas/${cita.id_cita}`, {
            method: "DELETE",
          });
  
          const data = await resp.json();
  
          if (!resp.ok) {
            return Swal.fire(
              'Error',
              data.error || 'No se pudo cancelar la cita.',
              'error'
            );
          }
  
          Swal.fire(
            'Cita cancelada',
            'La cita ha sido eliminada correctamente.',
            'success'
          );

          
          setCitas(prev => prev.filter(c => c.id_cita !== cita.id_cita));

          // Aquí puedes actualizar tu lista de citas
          // si tienes un useEffect o reload:
          // fetchCitas();
          // o:
          // Promise.all(
          //   [
          //     window.location.reload(),

          //   ]
          // )

  
        } catch (error) {
          console.error(error);
          Swal.fire(
            'Error',
            'Ocurrió un error al cancelar la cita.',
            'error'
          );
        }
      }
    });
  };
  



  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${colorHeader} text-white`}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Visitante
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Área
              </th>

              {isAdmin ? (
                <>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Placas/Modelo
                  </th>
                </>
              ) : (
                <>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Teléfono
                  </th>
                </>
              )}
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Ingreso
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Estado
              </th>
              {!isAdmin && (
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {citas.map((cita, index) => (
              <tr
                key={cita.id_cita || index}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {cita.fecha}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {cita.visitante.nombre}
                </td>
                {isAdmin  ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {cita.visitante.medioIngresos && cita.visitante.medioIngresos.length > 0 ? (
                        cita.visitante.medioIngresos[0].forma_ingreso === 'CARRO' ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">
                              {cita.visitante.medioIngresos[0].vehiculo?.modelo || 'N/A'}
                            </span>
                          </div>
                        ) : cita.visitante.medioIngresos[0].forma_ingreso === 'PIE' ? (
                          <span className="text-gray-400">A pie</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cita.area}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {cita.visitante.correo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {cita.visitante.celular}
                    </td>
                  </>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {cita.visitante.medioIngresos?.length > 0 ? (
                    cita.visitante.medioIngresos[0].forma_ingreso === "CARRO" ? (
                      <div className="flex flex-col">
                        <span className="font-medium">Vehiculo</span>
                      </div>
                    ) : (
                      <span className="">A pie</span>
                    )
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cita.estado === 'Actual'
                        ? 'bg-blue-100 text-green-800'
                        : cita.estado === 'Expirado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {cita.estado}
                  </span>
                </td>

                {!isAdmin && (
                  <td className="flex flex-col gap-2 px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {cita.estado === 'Actual' || 'Expirado'? (
                      <>
                        {/* Botón para Reagendar */}
                        <button
                          onClick={() => handleOpenModal(cita)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-2 font-medium text-sm shadow-sm ml-2"
                          title="Reagendar"
                        >
                          <FiCalendar className="w-4 h-4" />
                          Reagendar
                        </button>

                        {/* Modal de Reagendar */}
                        {isOpen && citaSeleccionada?.id_cita === cita.id_cita && (
                          <ReagendarModal
                            isOpen={isOpen}
                            cita={citaSeleccionada}
                            nuevaFechaHora={nuevaFechaHora}
                            error={error}
                            colorBtn={colorBtn}
                            onClose={handleCloseModal}
                            onSave={handleSave}
                            onFechaChange={handleFechaChange}
                            onHoraChange={handleHoraChange}
                          />
                        )}

                        {/* Botón para Ver Detalles */}
                        <button
                          onClick={() => handleOpenDetallesModal(cita)} // Abre el modal de detalles
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-2 font-medium text-sm shadow-sm ml-2"
                          title="Ver detalles"
                        >
                          <FiEye className="w-4 h-4" />
                          Ver Detalles
                        </button>

                      {/* Botón para Cancelar */}
<button
  onClick={() => handleCancelCita(cita)} // Ya conectado con la API
  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-2 font-medium text-sm shadow-sm ml-2"
  title="Cancelar cita"
>
  <FiX className="w-4 h-4" />
  Cancelar
</button>

                      </>
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
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">{citas.length}</span> de{' '}
          <span className="font-medium">{citas.length}</span> resultados
        </div>
      </div>
      {/* Modal de detalles */}
      {isDetallesOpen && citaSeleccionada && (
        <DetallesModal
          isOpen={isDetallesOpen}
          cita={citaSeleccionada}
          onClose={handleCloseDetallesModal}
        />
      )}


    </div>
  );
}
