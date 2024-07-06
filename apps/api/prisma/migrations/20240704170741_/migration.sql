/*
  Warnings:

  - You are about to drop the column `firstNames` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[personalNames,familyName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_firstNames_familyName_id_idx";

-- DropIndex
DROP INDEX "User_firstNames_familyName_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstNames",
ADD COLUMN     "personalNames" TEXT[];

-- CreateIndex
CREATE INDEX "User_personalNames_familyName_id_idx" ON "User"("personalNames", "familyName", "id");

-- CreateIndex
CREATE UNIQUE INDEX "User_personalNames_familyName_key" ON "User"("personalNames", "familyName");
