/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[personalNames,familyName,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_personalNames_familyName_idx";

-- DropIndex
DROP INDEX "User_personalNames_familyName_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_personalNames_familyName_email_idx" ON "User"("personalNames", "familyName", "email");

-- CreateIndex
CREATE UNIQUE INDEX "User_personalNames_familyName_email_key" ON "User"("personalNames", "familyName", "email");
