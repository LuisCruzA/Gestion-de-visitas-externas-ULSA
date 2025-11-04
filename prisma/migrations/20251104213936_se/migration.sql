-- CreateEnum
CREATE TYPE "FormaIngreso" AS ENUM ('PIE', 'CARRO');

-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('Actual', 'Expirado');

-- CreateTable
CREATE TABLE "Visitante" (
    "id_visitante" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "fechaNac" TIMESTAMP(3) NOT NULL,
    "ine" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "celular" TEXT NOT NULL,

    CONSTRAINT "Visitante_pkey" PRIMARY KEY ("id_visitante")
);

-- CreateTable
CREATE TABLE "MedioIngreso" (
    "id_ingreso" SERIAL NOT NULL,
    "visitanteid" INTEGER NOT NULL,
    "forma_ingreso" "FormaIngreso" NOT NULL,

    CONSTRAINT "MedioIngreso_pkey" PRIMARY KEY ("id_ingreso")
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id_vehiculo" SERIAL NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "id_ingreso" INTEGER NOT NULL,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id_vehiculo")
);

-- CreateTable
CREATE TABLE "Cita" (
    "id_cita" SERIAL NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'Actual',
    "fecha" TIMESTAMP(3) NOT NULL,
    "personaVisita" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,
    "visitanteId" INTEGER NOT NULL,

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id_cita")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_id_ingreso_key" ON "Vehiculo"("id_ingreso");

-- AddForeignKey
ALTER TABLE "MedioIngreso" ADD CONSTRAINT "MedioIngreso_visitanteid_fkey" FOREIGN KEY ("visitanteid") REFERENCES "Visitante"("id_visitante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_id_ingreso_fkey" FOREIGN KEY ("id_ingreso") REFERENCES "MedioIngreso"("id_ingreso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id_admin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Visitante"("id_visitante") ON DELETE RESTRICT ON UPDATE CASCADE;
