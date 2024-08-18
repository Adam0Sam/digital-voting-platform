/*
  Warnings:

  - A unique constraint covering the columns `[personalNames,familyName,grade,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_personalNames_familyName_email_idx";

-- DropIndex
DROP INDEX "User_personalNames_familyName_email_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "User_personalNames_familyName_grade_idx" ON "User"("personalNames", "familyName", "grade");

-- CreateIndex
CREATE UNIQUE INDEX "User_personalNames_familyName_grade_email_key" ON "User"("personalNames", "familyName", "grade", "email");
