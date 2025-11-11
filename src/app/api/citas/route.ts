import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const adminId = searchParams.get("adminId");
        const fecha = searchParams.get("fecha");
        const estado = searchParams.get("estado");

        const where: any = {};

        if (adminId) where.adminId = Number(adminId);
        if (estado) where.estado = estado;
        if (fecha) {
        const inicio = new Date(fecha);
        const fin = new Date(fecha);
        fin.setHours(23, 59, 59, 999);
        where.fecha = { gte: inicio, lte: fin };
        }

        const citas = await prisma.cita.findMany({
        where,
        include: {
            visitante: true,
            admin: true,
        },
        orderBy: { fecha: "asc" },
        });

        return NextResponse.json(citas);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener citas" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { fecha, visitanteId, adminId } = await req.json();
        const nuevaCita = await prisma.cita.create({
            data: {
                fecha,
                visitanteId,
                adminId,
            },
        });
        return NextResponse.json(nuevaCita, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error al crear cita" }, { status: 500 });
    }
}