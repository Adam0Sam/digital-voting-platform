/*
  Warnings:

  - You are about to drop the column `suggestedManagerId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `_ManagerSuggestions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_VoteSelections` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[voteSelectionId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[voteSuggestionId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `voteSelectionId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteSuggestionId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_suggestedManagerId_fkey";

-- DropForeignKey
ALTER TABLE "_ManagerSuggestions" DROP CONSTRAINT "_ManagerSuggestions_A_fkey";

-- DropForeignKey
ALTER TABLE "_ManagerSuggestions" DROP CONSTRAINT "_ManagerSuggestions_B_fkey";

-- DropForeignKey
ALTER TABLE "_VoteSelections" DROP CONSTRAINT "_VoteSelections_A_fkey";

-- DropForeignKey
ALTER TABLE "_VoteSelections" DROP CONSTRAINT "_VoteSelections_B_fkey";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "suggestedManagerId",
ADD COLUMN     "voteSelectionId" TEXT NOT NULL,
ADD COLUMN     "voteSuggestionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ManagerSuggestions";

-- DropTable
DROP TABLE "_VoteSelections";

-- CreateTable
CREATE TABLE "VoteSelection" (
    "id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "VoteSelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoteSuggestion" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "VoteSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CandidateToVoteSuggestion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CandidateToVoteSelection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VoteSuggestion_managerId_key" ON "VoteSuggestion"("managerId");

-- CreateIndex
CREATE UNIQUE INDEX "_CandidateToVoteSuggestion_AB_unique" ON "_CandidateToVoteSuggestion"("A", "B");

-- CreateIndex
CREATE INDEX "_CandidateToVoteSuggestion_B_index" ON "_CandidateToVoteSuggestion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CandidateToVoteSelection_AB_unique" ON "_CandidateToVoteSelection"("A", "B");

-- CreateIndex
CREATE INDEX "_CandidateToVoteSelection_B_index" ON "_CandidateToVoteSelection"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voteSelectionId_key" ON "Vote"("voteSelectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voteSuggestionId_key" ON "Vote"("voteSuggestionId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voteSelectionId_fkey" FOREIGN KEY ("voteSelectionId") REFERENCES "VoteSelection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voteSuggestionId_fkey" FOREIGN KEY ("voteSuggestionId") REFERENCES "VoteSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteSuggestion" ADD CONSTRAINT "VoteSuggestion_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToVoteSuggestion" ADD CONSTRAINT "_CandidateToVoteSuggestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToVoteSuggestion" ADD CONSTRAINT "_CandidateToVoteSuggestion_B_fkey" FOREIGN KEY ("B") REFERENCES "VoteSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToVoteSelection" ADD CONSTRAINT "_CandidateToVoteSelection_A_fkey" FOREIGN KEY ("A") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToVoteSelection" ADD CONSTRAINT "_CandidateToVoteSelection_B_fkey" FOREIGN KEY ("B") REFERENCES "VoteSelection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
