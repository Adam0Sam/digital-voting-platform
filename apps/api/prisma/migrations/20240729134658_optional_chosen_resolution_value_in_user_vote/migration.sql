-- DropForeignKey
ALTER TABLE "UserVote" DROP CONSTRAINT "UserVote_proposalResolutionValueId_fkey";

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "choiceCount" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "UserVote" ALTER COLUMN "proposalResolutionValueId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserVote" ADD CONSTRAINT "UserVote_proposalResolutionValueId_fkey" FOREIGN KEY ("proposalResolutionValueId") REFERENCES "ProposalResolutionValue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
