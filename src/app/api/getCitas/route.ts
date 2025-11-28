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
    const citas = await prisma.cita.findMany({
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
    });

 
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
