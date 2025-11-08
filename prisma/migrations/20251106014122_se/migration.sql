/*
  Warnings:

  - You are about to drop the column `departamento` on the `Cita` table. All the data in the column will be lost.
  - You are about to drop the column `personaVisita` on the `Cita` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cita" DROP COLUMN "departamento",
DROP COLUMN "personaVisita";
