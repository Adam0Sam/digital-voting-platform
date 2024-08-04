/*
  Warnings:

  - Made the column `proposalManagerRoleId` on table `ProposalManager` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProposalManager" DROP CONSTRAINT "ProposalManager_proposalManagerRoleId_fkey";

-- AlterTable
ALTER TABLE "ProposalManager" ALTER COLUMN "proposalManagerRoleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ProposalManager" ADD CONSTRAINT "ProposalManager_proposalManagerRoleId_fkey" FOREIGN KEY ("proposalManagerRoleId") REFERENCES "ProposalManagerRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
