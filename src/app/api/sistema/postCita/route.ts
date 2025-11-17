// app/api/citas/route.ts (en Next.js 13+ con App Directory)

import { prisma } from "@/app/lib/prisma";
import { sendEmail } from "@/app/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en el backend:", body);
    const { fecha, adminId, visitante, medioIngreso, vehiculo,cita } = body;
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
          color:vehiculo.color,
          placas:vehiculo.placas,
          id_ingreso: newIngreso.id_ingreso,
        },
      });
    }

    // Crear la cita
    const newCita = await prisma.cita.create({
      data: {
        fecha: fechaobj,
        area: cita.area ,
        personaVisitada:cita.personaVisitada,
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1E3A8A, #0A1E6A); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">Nueva Cita Registrada</h2>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
          <p>Estimado/a <strong>${admin.nombre}</strong>,</p>
          <p>Se ha registrado una nueva cita:</p>
          <div style="background: white; padding: 15px; border-left: 4px solid #1E3A8A; margin: 15px 0;">
            <p><strong>Cita #${newCita.id_cita}</strong></p>
            <p><strong>Visitante:</strong> ${newVisitante.nombre}</p>
            <p><strong>Fecha:</strong> ${new Date(newCita.fecha).toLocaleString('es-MX')}</p>
            <p><strong>Correo:</strong> ${newVisitante.correo}</p>
            <p><strong>Teléfono:</strong> ${newVisitante.celular}</p>
            <p><strong>Ingreso:</strong> ${medioIngreso.forma_ingreso}</p>
            ${vehiculo ? `<p><strong>Vehículo:</strong> ${vehiculo.marca} ${vehiculo.modelo}</p>` : ''}
          </div>
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">Universidad La Salle - Sistema de Gestión de Visitas</p>
        </div>
      </div>
    `;

    // Enviar correo al visitante
    const visitanteSubject = `Confirmación de cita: ${newCita.id_cita}`;
    const visitanteText = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #60A5FA, #3B82F6); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;"> Confirmación de Cita</h2>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
          <p>Hola <strong>${newVisitante.nombre}</strong>,</p>
          <p>¡Tu cita ha sido registrada exitosamente!</p>
          <div style="background: white; padding: 15px; border-left: 4px solid #3B82F6; margin: 15px 0;">
            <p><strong>Cita #${newCita.id_cita}</strong></p>
            <p> <strong>Fecha:</strong> ${new Date(newCita.fecha).toLocaleString('es-MX')}</p>
            <p> <strong>Ingreso:</strong> ${medioIngreso.forma_ingreso}</p>
            ${vehiculo ? `<p><strong>Vehículo:</strong> ${vehiculo.marca} ${vehiculo.modelo}</p>` : ''}
            <p> <strong>Area:</strong> ${newCita.area}</p>
            <p> <strong>Persona a visitar:</strong> ${newCita.personaVisitada}</p>

          </div>
          <div style="background: #E0F2FE; padding: 10px; border-left: 4px solid #0EA5E9; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Recordatorios:</strong></p>
            <ul style="margin: 5px 0; padding-left: 20px;">
              <li>Llega 10 minutos antes</li>
              <li>Trae identificación oficial</li>
              ${vehiculo ? '<li>Presenta tarjeta de circulación</li>' : ''}
            </ul>
          </div>
          <p style="text-align: center;">¡Nos vemos pronto!</p>
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">Universidad La Salle - Sistema de Gestión de Visitas</p>
        </div>
      </div>
    `;

    Promise.all([
      sendEmail(admin.correo, adminSubject, adminText),
      sendEmail(newVisitante.correo, visitanteSubject, visitanteText),
    ])
    console.log("Datos guardados en el backend:", newCita);


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
