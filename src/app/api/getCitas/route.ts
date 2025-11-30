import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Obtener el adminId de los headers de la solicitud
    const adminId = req.headers.get("adminId");

    if (!adminId) {
      return new Response(
        JSON.stringify({ error: "No autorizado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Filtrar las citas por adminId
    let citas = await prisma.cita.findMany({
      where: {
        adminId: Number(adminId), // Filtrar las citas solo para el admin logueado
      },
      include: {
        visitante: {
          include: {
            medioIngresos: {
              include: {
                vehiculo: true, // Si necesitas incluir los detalles del vehículo
              },
            },
          },
        },
      },
      orderBy: {
        fecha: "asc",
      }
    });

     // Determinar cuáles ya expiraron
     const ahora = new Date();
     const expiradasIds = citas
       .filter(c => c.estado === "Actual" && new Date(c.fecha) < ahora)
       .map(c => c.id_cita);
 
     // Actualizar estado a "Expirado" en lote
     if (expiradasIds.length > 0) {
       await prisma.cita.updateMany({
         where: {
           id_cita: { in: expiradasIds }
         },
         data: {
           estado: "Expirado"
         }
       });
 
       //  Volver a consultar las citas ya actualizadas
       citas = await prisma.cita.findMany({
         where: {
           adminId: Number(adminId),
         },
         include: {
           visitante: {
             include: {
               medioIngresos: {
                 include: {
                   vehiculo: true,
                 },
               },
             },
           },
         },
         orderBy: {
           fecha: "asc",
         }
       });
     }
 
 
    console.log(citas)
    return new Response(JSON.stringify(citas, ), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener las citas" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
