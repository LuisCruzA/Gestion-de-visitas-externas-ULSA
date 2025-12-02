// app/api/citas/route.ts
import { prisma } from "@/app/lib/prisma";
import { sendEmail } from "@/app/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en el backend:", body);
    const { fecha, adminId, visitante, medioIngreso, vehiculo, cita } = body;
    const fechaobj = new Date(fecha);

    fechaobj.setHours(fechaobj.getHours() - 6);
    const inicio = new Date(fechaobj);
    const fin = new Date(fechaobj);

    // Verificar si el admin ya tiene una cita en ese horario
    const citaExistente = await prisma.cita.findFirst({
      where: {
        adminId: adminId,
        fecha: {
          gte: inicio,
          lt: fin,
        },
      },
    });

    if (citaExistente) {
      return new Response(
        JSON.stringify({ error: "El administrador ya tiene una cita en ese horario." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let newVisitante;
    let mensajeVisitante = "";

    // ✅ VERIFICAR SI EL VISITANTE YA EXISTE (por ID)
    if (visitante.id) {
      // ✅ ACTUALIZAR visitante existente
      newVisitante = await prisma.visitante.update({
        where: { id_visitante: visitante.id },
        data: {
          nombre: visitante.nombre,
          genero: visitante.genero,
          fechaNac: new Date(visitante.fechaNac),
          celular: visitante.celular,
          // ❌ INE NO se actualiza
        },
      });
      mensajeVisitante = "Datos del visitante actualizados";
      console.log(`✅ Visitante ${newVisitante.id_visitante} actualizado`);
    } else {
      // ✅ CREAR nuevo visitante
      newVisitante = await prisma.visitante.create({
        data: {
          nombre: visitante.nombre,
          genero: visitante.genero,
          fechaNac: new Date(visitante.fechaNac),
          ine: visitante.ine,
          correo: visitante.correo,
          celular: visitante.celular,
        },
      });
      mensajeVisitante = "Visitante creado";
      console.log(`✅ Nuevo visitante ${newVisitante.id_visitante} creado`);
    }

    // Crear el medio de ingreso
    const newIngreso = await prisma.medioIngreso.create({
      data: {
        visitanteid: newVisitante.id_visitante,
        forma_ingreso: medioIngreso.forma_ingreso,
      },
    });

    // Crear el vehículo si lo hay
    let newVehiculo = null;
    if (vehiculo) {
      newVehiculo = await prisma.vehiculo.create({
        data: {
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          color: vehiculo.color,
          placas: vehiculo.placas,
          id_ingreso: newIngreso.id_ingreso,
        },
      });
    }

    // Crear la cita
    const newCita = await prisma.cita.create({
      data: {
        fecha: fechaobj,
        area: cita.area,
        personaVisitada: cita.personaVisitada,
        adminId: adminId,
        visitanteId: newVisitante.id_visitante,
        estado: 'Actual',
      },
    });

    fin.setMinutes(inicio.getMinutes() + 30);

    // Obtener los detalles del admin para el correo
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
            ${visitante.id ? '<p style="color: #0EA5E9;"><em>⚠️ Visitante recurrente - Datos actualizados</em></p>' : ''}
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
          <h2 style="margin: 0;">✅ Confirmación de Cita</h2>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
          <p>Hola <strong>${newVisitante.nombre}</strong>,</p>
          <p>¡Tu cita ha sido registrada exitosamente!</p>
          <div style="background: white; padding: 15px; border-left: 4px solid #3B82F6; margin: 15px 0;">
            <p><strong>Cita #${newCita.id_cita}</strong></p>
            <p><strong>Fecha:</strong> ${new Date(newCita.fecha).toLocaleString('es-MX')}</p>
            <p><strong>Ingreso:</strong> ${medioIngreso.forma_ingreso}</p>
            ${vehiculo ? `<p><strong>Vehículo:</strong> ${vehiculo.marca} ${vehiculo.modelo}</p>` : ''}
            <p><strong>Área:</strong> ${newCita.area || 'No especificada'}</p>
            <p><strong>Persona a visitar:</strong> ${newCita.personaVisitada || 'No especificada'}</p>
          </div>
          <div style="background: #E0F2FE; padding: 10px; border-left: 4px solid #0EA5E9; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>📋 Recordatorios:</strong></p>
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

    // Enviar correos de forma asíncrona
    Promise.all([
      sendEmail(admin.correo, adminSubject, adminText),
      sendEmail(newVisitante.correo, visitanteSubject, visitanteText),
    ]).catch(err => console.error("Error al enviar correos:", err));

    console.log("Datos guardados en el backend:", newCita);

    return new Response(
      JSON.stringify({ 
        message: `Cita creada exitosamente. ${mensajeVisitante}`,
        newCita,
        visitanteActualizado: !!visitante.id 
      }), 
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error("Error en POST /api/citas:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }), 
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}