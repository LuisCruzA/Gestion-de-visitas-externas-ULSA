/*
  Warnings:

  - You are about to drop the column `rol` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "rol",
ADD COLUMN     "areaAdmin" TEXT,
ADD COLUMN     "esSuperadmin" BOOLEAN NOT NULL DEFAULT false;
