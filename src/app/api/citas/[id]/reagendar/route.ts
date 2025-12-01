import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/nodemailer";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const citaId = Number(id);
    const { fecha, hora } = await req.json();

    if (!fecha || !hora) {
      return NextResponse.json(
        { error: "Fecha u hora incompletas" },
        { status: 400 }
      );
    }

    // 1️⃣ Construir la fecha/hora LOCAL que viene del front
    const fechaLocal = new Date(`${fecha}T${hora}:00`);

    // 2️⃣ Aplicar la misma corrección que usas al CREAR la cita (–6 horas)
    fechaLocal.setHours(fechaLocal.getHours() - 6);

    // 3️⃣ Obtener info de la cita actual
    const cita = await prisma.cita.findUnique({
      where: { id_cita: citaId },
      include: {
        visitante: true,
        admin: true,
      },
    });

    if (!cita) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }

    // 4️⃣ Validar choque con otras citas del mismo admin (ventana de 30 minutos)
    const inicio = new Date(fechaLocal);
    const fin = new Date(fechaLocal);
    fin.setMinutes(inicio.getMinutes() + 30); // misma lógica que en POST

    const choque = await prisma.cita.findFirst({
      where: {
        adminId: cita.adminId,
        id_cita: { not: citaId }, // excluir la propia
        fecha: {
          gte: inicio,
          lt: fin,
        },
      },
    });

    if (choque) {
      return NextResponse.json(
        { error: "Ya existe una cita en ese horario." },
        { status: 400 }
      );
    }

    // 5️⃣ Actualizar la cita: nueva fecha y estado vuelve a "Actual"
    const citaActualizada = await prisma.cita.update({
      where: { id_cita: citaId },
      data: {
        fecha: fechaLocal,
        estado: "Actual", // si estaba Expirado, vuelve a Actual
      },
    });

    // 6️⃣ Preparar fecha legible para correos (convertir desde lo guardado)
    const fechaLegible = new Date(citaActualizada.fecha).toLocaleString(
      "es-MX"
    );

    // CORREO para admin
    const correoAdmin = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1E3A8A, #0A1E6A); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">Cita Reagendada</h2>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
          <p>Estimado/a <strong>${cita.admin.nombre}</strong>,</p>
          <p>La cita <strong>#${citaId}</strong> ha sido reagendada.</p>
          <div style="background: white; padding: 15px; border-left: 4px solid #1E3A8A; margin: 15px 0;">
            <p><strong>Visitante:</strong> ${cita.visitante.nombre}</p>
            <p><strong>Nueva fecha:</strong> ${fechaLegible}</p>
            <p><strong>Correo visitante:</strong> ${cita.visitante.correo}</p>
            <p><strong>Teléfono:</strong> ${cita.visitante.celular}</p>
          </div>
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">Universidad La Salle - Sistema de Gestión de Visitas</p>
        </div>
      </div>
    `;

    //  CORREO para visitante
    const correoVisitante = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #60A5FA, #3B82F6); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">Cita Reagendada</h2>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
          <p>Hola <strong>${cita.visitante.nombre}</strong>,</p>
          <p>Tu cita ha sido reagendada con éxito.</p>
          <div style="background: white; padding: 15px; border-left: 4px solid #3B82F6; margin: 15px 0;">
            <p><strong>Cita #${citaId}</strong></p>
            <p><strong>Nueva fecha:</strong> ${fechaLegible}</p>
          </div>
          <p style="text-align: center;">Te esperamos en la nueva fecha.</p>
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">Universidad La Salle - Sistema de Gestión de Visitas</p>
        </div>
      </div>
    `;

    Promise.all([
      sendEmail(cita.admin.correo, "Cita reagendada", correoAdmin),
      sendEmail(cita.visitante.correo, "Tu cita ha sido reagendada", correoVisitante),
    ]);

    return NextResponse.json(
      {
        message: "Cita reagendada correctamente",
        cita: citaActualizada,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reagendar error:", error);
    return NextResponse.json(
      { error: "Error al reagendar la cita" },
      { status: 500 }
    );
  }
}
