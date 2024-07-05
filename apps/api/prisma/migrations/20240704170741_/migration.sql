/*
  Warnings:

  - You are about to drop the column `firstNames` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[personalNames,lastName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_firstNames_lastName_id_idx";

-- DropIndex
DROP INDEX "User_firstNames_lastName_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstNames",
ADD COLUMN     "personalNames" TEXT[];

-- CreateIndex
CREATE INDEX "User_personalNames_lastName_id_idx" ON "User"("personalNames", "lastName", "id");

-- CreateIndex
CREATE UNIQUE INDEX "User_personalNames_lastName_key" ON "User"("personalNames", "lastName");
