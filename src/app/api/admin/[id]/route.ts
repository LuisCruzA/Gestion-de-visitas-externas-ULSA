import {prisma} from "@/app/lib/prisma";
import {NextResponse} from "next/server";

export async function GET(_: Request, context: {params: Promise<{id: string}>}) {
    try {
        const { id } = await context.params;
        const admins = await prisma.admin.findUnique({
            where: {id_admin: Number(id)},
        });
        if (!admins) return NextResponse.json({error: "Administrador no encontrado"}, {status: 404});
        return NextResponse.json(admins);

    } catch (error) {
        return NextResponse.json({error: "Error al obtener administrador"}, {status: 500});
    }
}

export async function PUT(req: Request, context :{params: Promise<{id: string}>}) {
    try{
        const data = await req.json();
        const {id} = await context.params;
        const AdminActualizado = await prisma.admin.update({
            where: {id_admin: Number(id)},
            data
        })
        return NextResponse.json(AdminActualizado);
    }
    catch (error) {
        return NextResponse.json({error: "Error al actualizar administrador"}, {status: 500});
    }
}

export async function DELETE(_: Request, context: {params: Promise<{id: string}>}) {
    try{
        const { id } = await context.params;
        await prisma.admin.delete({
            where: {id_admin: Number(id)},
        });
        return NextResponse.json({message: "Administrador eliminado correctamente"});
    }
    catch (error) {
        return NextResponse.json({error: "Error al eliminar administrador"}, {status: 500});
    }
}