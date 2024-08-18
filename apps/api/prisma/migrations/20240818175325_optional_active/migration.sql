/*
  Warnings:

  - A unique constraint covering the columns `[personalNames,familyName,grade]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_personalNames_familyName_grade_email_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "active" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_personalNames_familyName_grade_key" ON "User"("personalNames", "familyName", "grade");
