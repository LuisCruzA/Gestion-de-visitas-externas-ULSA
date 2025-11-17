import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const {correo, contrasena} = await req.json();
        const admin = await prisma.admin.findUnique({
            where: {correo}
        })
        if (!admin){
            return NextResponse.json({error: "Correo no registrado"}, {status: 404});
        }

        const validPassword = bcrypt.compareSync(contrasena, admin.contrasena);
        if (!validPassword){
            return NextResponse.json({error: "Contraseña incorrecta"}, {status: 401});
        }

        const {contrasena: _, ...adminSinContrasena} = admin;
        return NextResponse.json({message:"Inicio de sesión exitoso", admin: adminSinContrasena});


    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Error al iniciar sesión"}, {status: 500});
    }
}