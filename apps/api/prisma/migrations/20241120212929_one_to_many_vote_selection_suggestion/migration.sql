/*
  Warnings:

  - You are about to drop the column `voteSelectionId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `voteSuggestionId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `_CandidateToVoteSelection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CandidateToVoteSuggestion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `candidateId` to the `VoteSelection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidateId` to the `VoteSuggestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_voteSelectionId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_voteSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "_CandidateToVoteSelection" DROP CONSTRAINT "_CandidateToVoteSelection_A_fkey";

-- DropForeignKey
ALTER TABLE "_CandidateToVoteSelection" DROP CONSTRAINT "_CandidateToVoteSelection_B_fkey";

-- DropForeignKey
ALTER TABLE "_CandidateToVoteSuggestion" DROP CONSTRAINT "_CandidateToVoteSuggestion_A_fkey";

-- DropForeignKey
ALTER TABLE "_CandidateToVoteSuggestion" DROP CONSTRAINT "_CandidateToVoteSuggestion_B_fkey";

-- DropIndex
DROP INDEX "Vote_voteSelectionId_key";

-- DropIndex
DROP INDEX "Vote_voteSuggestionId_key";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "voteSelectionId",
DROP COLUMN "voteSuggestionId";

-- AlterTable
ALTER TABLE "VoteSelection" ADD COLUMN     "candidateId" TEXT NOT NULL,
ADD COLUMN     "voteId" TEXT;

-- AlterTable
ALTER TABLE "VoteSuggestion" ADD COLUMN     "candidateId" TEXT NOT NULL,
ADD COLUMN     "voteId" TEXT;

-- DropTable
DROP TABLE "_CandidateToVoteSelection";

-- DropTable
DROP TABLE "_CandidateToVoteSuggestion";

-- AddForeignKey
ALTER TABLE "VoteSelection" ADD CONSTRAINT "VoteSelection_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "Vote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteSelection" ADD CONSTRAINT "VoteSelection_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteSuggestion" ADD CONSTRAINT "VoteSuggestion_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "Vote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteSuggestion" ADD CONSTRAINT "VoteSuggestion_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
