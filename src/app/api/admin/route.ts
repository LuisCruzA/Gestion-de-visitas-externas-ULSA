import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const admins = await prisma.admin.findMany();
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener administradores" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nombre, correo, contrasena, areaAdmin, esSuperadmin } = await req.json();

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoAdmin = await prisma.admin.create({
      data: {
        nombre,
        correo,
        contrasena: hashedPassword,
        areaAdmin,
        esSuperadmin,
      },
    });

    const { contrasena: _, ...adminSinPassword } = nuevoAdmin;
    return NextResponse.json(adminSinPassword, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear administrador" }, { status: 500 });
  }
}
