/*
  Warnings:

  - Added the required column `resolutionDate` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "resolutionDate" TIMESTAMP(3) NOT NULL;
