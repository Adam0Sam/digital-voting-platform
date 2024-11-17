/*
  Warnings:

  - You are about to drop the column `canEditStatus` on the `ManagerPermissions` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "VoteStatus" ADD VALUE 'DISABLED';

-- AlterTable
ALTER TABLE "ManagerPermissions" DROP COLUMN "canEditStatus",
ADD COLUMN     "canEditProposalStatus" BOOLEAN NOT NULL DEFAULT false;
