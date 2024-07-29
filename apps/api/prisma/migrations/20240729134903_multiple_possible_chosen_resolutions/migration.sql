/*
  Warnings:

  - You are about to drop the column `proposalResolutionValueId` on the `UserVote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserVote" DROP CONSTRAINT "UserVote_proposalResolutionValueId_fkey";

-- AlterTable
ALTER TABLE "UserVote" DROP COLUMN "proposalResolutionValueId";

-- CreateTable
CREATE TABLE "_ProposalResolutionValueToUserVote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProposalResolutionValueToUserVote_AB_unique" ON "_ProposalResolutionValueToUserVote"("A", "B");

-- CreateIndex
CREATE INDEX "_ProposalResolutionValueToUserVote_B_index" ON "_ProposalResolutionValueToUserVote"("B");

-- AddForeignKey
ALTER TABLE "_ProposalResolutionValueToUserVote" ADD CONSTRAINT "_ProposalResolutionValueToUserVote_A_fkey" FOREIGN KEY ("A") REFERENCES "ProposalResolutionValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProposalResolutionValueToUserVote" ADD CONSTRAINT "_ProposalResolutionValueToUserVote_B_fkey" FOREIGN KEY ("B") REFERENCES "UserVote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
