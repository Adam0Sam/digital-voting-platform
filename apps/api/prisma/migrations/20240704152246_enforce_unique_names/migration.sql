/*
  Warnings:

  - A unique constraint covering the columns `[firstNames,familyName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_firstNames_familyName_key" ON "User"("firstNames", "familyName");
