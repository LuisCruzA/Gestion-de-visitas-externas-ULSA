// app/api/citas/route.ts (en Next.js 13+ con App Directory)

import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fecha, adminId, visitante, medioIngreso, vehiculo } = body;
    const fechaobj = new Date(fecha); // Mantener la hora local del frontend


    // Crear el visitante
    const newVisitante = await prisma.visitante.create({
      data: {
        nombre: visitante.nombre,
        genero: visitante.genero,
        fechaNac: new Date(visitante.fechaNac),
        ine: visitante.ine,
        correo: visitante.correo,
        celular: visitante.celular,
      },
    });

    // Crear el medio de ingreso
    const newIngreso = await prisma.medioIngreso.create({
      data: {
        visitanteid: newVisitante.id_visitante,
        forma_ingreso: medioIngreso.forma_ingreso,
      },
    });

    // Crear el vehículo si lo hay
    let newVehiculo = null ;
    if (vehiculo) {
      newVehiculo = await prisma.vehiculo.create({
        data: {
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          id_ingreso: newIngreso.id_ingreso,
        },
      });
    }

    // Crear la cita
    const newCita = await prisma.cita.create({
      data: {
        fecha: fechaobj,
        adminId: adminId,
        visitanteId: newVisitante.id_visitante,
        estado: 'Actual',
      },
    });

    return new Response(JSON.stringify({ message: 'Cita creada exitosamente', newCita }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
