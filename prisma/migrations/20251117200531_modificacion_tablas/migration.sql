-- AlterTable
ALTER TABLE "Cita" ADD COLUMN     "area" TEXT,
ADD COLUMN     "personaVisitada" TEXT;

-- AlterTable
ALTER TABLE "Vehiculo" ADD COLUMN     "color" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "placas" TEXT NOT NULL DEFAULT 'N/A';
