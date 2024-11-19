/*
  Warnings:

  - You are about to drop the column `managerId` on the `Vote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_managerId_fkey";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "managerId",
ADD COLUMN     "suggestedManagerId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_suggestedManagerId_fkey" FOREIGN KEY ("suggestedManagerId") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;
