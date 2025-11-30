-- DropForeignKey
ALTER TABLE "Cita" DROP CONSTRAINT "Cita_visitanteId_fkey";

-- DropForeignKey
ALTER TABLE "MedioIngreso" DROP CONSTRAINT "MedioIngreso_visitanteid_fkey";

-- DropForeignKey
ALTER TABLE "Vehiculo" DROP CONSTRAINT "Vehiculo_id_ingreso_fkey";

-- AddForeignKey
ALTER TABLE "MedioIngreso" ADD CONSTRAINT "MedioIngreso_visitanteid_fkey" FOREIGN KEY ("visitanteid") REFERENCES "Visitante"("id_visitante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_id_ingreso_fkey" FOREIGN KEY ("id_ingreso") REFERENCES "MedioIngreso"("id_ingreso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Visitante"("id_visitante") ON DELETE CASCADE ON UPDATE CASCADE;
