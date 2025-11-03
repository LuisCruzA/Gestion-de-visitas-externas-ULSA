// este fue un ejemplo puedes guiarte de este para ver como funciona o como se relaciona a prisma y base de datos
// lo puedes borrar si quiers Yamir :)
import { prisma } from "@/app/lib/prisma"; // Ajusta la ruta según tu estructura

export async function GET() {
  try {
    const admins = await prisma.admin.findMany();
    return new Response(JSON.stringify(admins), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, correo, contrasena, rol } = body;

    const nuevoAdmin = await prisma.admin.create({
      data: { nombre, correo, contrasena, rol },
    });

    return new Response(JSON.stringify(nuevoAdmin), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
