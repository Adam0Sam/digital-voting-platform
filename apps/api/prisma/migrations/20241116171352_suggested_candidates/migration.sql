/*
  Warnings:

  - You are about to drop the `_CandidateToVote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CandidateToVote" DROP CONSTRAINT "_CandidateToVote_A_fkey";

-- DropForeignKey
ALTER TABLE "_CandidateToVote" DROP CONSTRAINT "_CandidateToVote_B_fkey";

-- DropTable
DROP TABLE "_CandidateToVote";

-- CreateTable
CREATE TABLE "_VoteSelections" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ManagerSuggestions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_VoteSelections_AB_unique" ON "_VoteSelections"("A", "B");

-- CreateIndex
CREATE INDEX "_VoteSelections_B_index" ON "_VoteSelections"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ManagerSuggestions_AB_unique" ON "_ManagerSuggestions"("A", "B");

-- CreateIndex
CREATE INDEX "_ManagerSuggestions_B_index" ON "_ManagerSuggestions"("B");

-- AddForeignKey
ALTER TABLE "_VoteSelections" ADD CONSTRAINT "_VoteSelections_A_fkey" FOREIGN KEY ("A") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VoteSelections" ADD CONSTRAINT "_VoteSelections_B_fkey" FOREIGN KEY ("B") REFERENCES "Vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ManagerSuggestions" ADD CONSTRAINT "_ManagerSuggestions_A_fkey" FOREIGN KEY ("A") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ManagerSuggestions" ADD CONSTRAINT "_ManagerSuggestions_B_fkey" FOREIGN KEY ("B") REFERENCES "Vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
