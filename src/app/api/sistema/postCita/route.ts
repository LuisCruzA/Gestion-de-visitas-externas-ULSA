// app/api/citas/route.ts (en Next.js 13+ con App Directory)

import { prisma } from "@/app/lib/prisma";
import { sendEmail } from "@/app/lib/nodemailer";

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

    

    // Obtener los detalles del admin y visitante para el correo
    const admin = await prisma.admin.findUnique({
      where: { id_admin: adminId },
    });

    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Administrador no encontrado" }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // Enviar correo al admin
    const adminSubject = `Nueva cita registrada: ${newCita.id_cita}`;
    const adminText = `
      Se ha registrado una nueva cita con los siguientes detalles:
      - Nombre del visitante: ${newVisitante.nombre}
      - Fecha y hora de la cita: ${newCita.fecha}
      - Medio de ingreso: ${medioIngreso.forma_ingreso}
    `;
    await sendEmail(admin.correo, adminSubject, adminText);


    // Enviar correo al visitante
    const visitanteSubject = `Confirmación de cita: ${newCita.id_cita}`;
    const visitanteText = `
      Hola ${newVisitante.nombre},
      
      Tu cita ha sido registrada con éxito. Aquí están los detalles:
      - Fecha y hora de la cita: ${newCita.fecha}
      - Medio de ingreso: ${medioIngreso.forma_ingreso}
      ${vehiculo ? `- Vehículo: ${vehiculo.marca} ${vehiculo.modelo}` : ''}
      
      ¡Nos vemos pronto!
    `;
    await sendEmail(newVisitante.correo, visitanteSubject, visitanteText);

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
