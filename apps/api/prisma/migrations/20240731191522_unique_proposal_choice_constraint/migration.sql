/*
  Warnings:

  - A unique constraint covering the columns `[value,proposalId]` on the table `ProposalChoice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "ProposalChoice_value_proposalId_key" ON "ProposalChoice"("value", "proposalId");
