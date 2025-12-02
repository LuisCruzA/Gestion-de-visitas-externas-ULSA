import { prisma } from "@/app/lib/prisma";

// En tu API /api/visitantes/verificar
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ine = searchParams.get('ine');
  const correo = searchParams.get('correo');

  if(!ine || !correo ){
    return Response.json({error: "No existe INE o correo"},{status: 500})
  }

  // Buscar por INE (debe ser único)
  const visitantePorIne = await prisma.visitante.findFirst({
    where: { ine: ine }
  });

  // Buscar por correo
  const visitantePorCorreo = await prisma.visitante.findFirst({
    where: { correo: correo }
  });

  // ✅ Validar inconsistencias
  if (visitantePorIne && visitantePorCorreo) {
    if (visitantePorIne.id_visitante !== visitantePorCorreo.id_visitante) {
      return Response.json({
        existe: true,
        error: "CONFLICTO",
        mensaje: "El INE y el correo pertenecen a diferentes personas"
      }, { status: 400 });
    }
  }

  const visitante = visitantePorIne || visitantePorCorreo;

  return Response.json({
    existe: !!visitante,
    visitante: visitante || null,
    coincidencias: {
      ine: !!visitantePorIne,
      correo: !!visitantePorCorreo
    }
  });
}