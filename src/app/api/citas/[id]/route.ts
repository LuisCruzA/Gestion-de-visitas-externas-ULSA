import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sendEmail } from "@/app/lib/nodemailer";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // 🔥 Necesario en Next 14
    const citaId = Number(id);

    if (!citaId) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    // Buscar cita para obtener el visitanteId
    const cita = await prisma.cita.findUnique({
      where: { id_cita: citaId },
      include: {
        visitante: {
          include: {
            medioIngresos: {
              include: { vehiculo: true }
            }
          }
        },
        admin: true

      }
    });

    if (!cita) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }

    const visitanteId = cita.visitanteId;
    const admin = cita.admin;


    // Eliminar vehículo(s)
    await prisma.vehiculo.deleteMany({
      where: { ingreso: { visitanteid: visitanteId } }
    });

    // Eliminar medio ingreso
    await prisma.medioIngreso.deleteMany({
      where: { visitanteid: visitanteId }
    });

    // Eliminar cita
    await prisma.cita.delete({
      where: { id_cita: citaId }
    });

    // Eliminar visitante
    //await prisma.visitante.delete({
      //where: { id_visitante: visitanteId }
    //});


    //  CORREO PARA ADMIN
    const adminSubject = `Cancelación de cita #${cita.id_cita}`;
    const adminHtml = `
      <div style="font-family: Arial; max-width:600px; margin:auto;">
        <div style="background:#7f1d1d; color:white; padding:20px; text-align:center; border-radius:8px 8px 0 0;">
          <h2>Cita Cancelada</h2>
        </div>
        <div style="background:#f9f9f9; padding:20px; border-radius:0 0 8px 8px;">
          <p>Estimado/a <strong>${admin.nombre}</strong>,</p>
          <p>La siguiente cita ha sido <strong>cancelada</strong>:</p>

          <div style="background:white; padding:15px; border-left:4px solid #dc2626; margin:15px 0;">
            <p><strong>Cita #: </strong>${cita.id_cita}</p>
            <p><strong>Visitante:</strong> ${cita.visitante.nombre}</p>
            <p><strong>Fecha:</strong> ${new Date(cita.fecha).toLocaleString('es-MX')}</p>
            <p><strong>Correo del visitante:</strong> ${cita.visitante.correo}</p>
            <p><strong>Teléfono:</strong> ${cita.visitante.celular}</p>
            <p><strong>Área:</strong> ${cita.area ?? 'N/A'}</p>
            <p><strong>Persona a visitar:</strong> ${cita.personaVisitada ?? 'N/A'}</p>
          </div>

          <p style="font-size:12px; text-align:center; color:#555;">Universidad La Salle — Sistema de Gestión de Visitas</p>
        </div>
      </div>
    `;

    // 📨 CORREO PARA VISITANTE
    const visitanteSubject = `Tu cita #${cita.id_cita} ha sido cancelada`;
    const visitanteHtml = `
      <div style="font-family: Arial; max-width:600px; margin:auto;">
        <div style="background:#7f1d1d; color:white; padding:20px; text-align:center; border-radius:8px 8px 0 0;">
          <h2>Cita Cancelada</h2>
        </div>

        <div style="background:#f9f9f9; padding:20px; border-radius:0 0 8px 8px;">
          <p>Hola <strong>${cita.visitante.nombre}</strong>,</p>
          <p>Lamentamos informarte que tu cita ha sido <strong>cancelada</strong>.</p>

          <div style="background:white; padding:15px; border-left:4px solid #2563eb; margin:15px 0;">
            <p><strong>Cita #:</strong> ${cita.id_cita}</p>
            <p><strong>Fecha:</strong> ${new Date(cita.fecha).toLocaleString('es-MX')}</p>
            <p><strong>Área:</strong> ${cita.area ?? 'N/A'}</p>
            <p><strong>Persona a visitar:</strong> ${cita.personaVisitada ?? 'N/A'}</p>
          </div>

          <p>Si necesitas reprogramarla, puedes ponerte en contacto nuevamente.</p>

          <p style="font-size:12px; text-align:center; color:#555;">Universidad La Salle — Sistema de Gestión de Visitas</p>
        </div>
      </div>
    `;

    // Envío en paralelo
     Promise.all([
      sendEmail(admin.correo, adminSubject, adminHtml),
      sendEmail(cita.visitante.correo, visitanteSubject, visitanteHtml)
    ]);

    return NextResponse.json({
      message: "Cita eliminada correctamente"
    });

  } catch (error) {
    console.error("DELETE cita error:", error);
    return NextResponse.json(
      { error: "Error al eliminar la cita" },
      { status: 500 }
    );
  }
}
