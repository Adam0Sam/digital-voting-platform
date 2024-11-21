/*
  Warnings:

  - You are about to drop the column `managerId` on the `VoteSuggestion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[suggestedByManagerId]` on the table `VoteSuggestion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `suggestedByManagerId` to the `VoteSuggestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VoteSuggestion" DROP CONSTRAINT "VoteSuggestion_managerId_fkey";

-- DropIndex
DROP INDEX "VoteSuggestion_managerId_key";

-- AlterTable
ALTER TABLE "VoteSuggestion" DROP COLUMN "managerId",
ADD COLUMN     "suggestedByManagerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VoteSuggestion_suggestedByManagerId_key" ON "VoteSuggestion"("suggestedByManagerId");

-- AddForeignKey
ALTER TABLE "VoteSuggestion" ADD CONSTRAINT "VoteSuggestion_suggestedByManagerId_fkey" FOREIGN KEY ("suggestedByManagerId") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;
