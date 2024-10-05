/*
  Warnings:

  - You are about to drop the column `canEditAvailableChoices` on the `ManagerPermissions` table. All the data in the column will be lost.
  - You are about to drop the column `canEditVoteChoices` on the `ManagerPermissions` table. All the data in the column will be lost.
  - You are about to drop the `ProposalChoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProposalManager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProposalManagerRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProposalChoiceToVote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProposalChoice" DROP CONSTRAINT "ProposalChoice_proposalId_fkey";

-- DropForeignKey
ALTER TABLE "ProposalManager" DROP CONSTRAINT "ProposalManager_proposalId_fkey";

-- DropForeignKey
ALTER TABLE "ProposalManager" DROP CONSTRAINT "ProposalManager_proposalManagerRoleId_fkey";

-- DropForeignKey
ALTER TABLE "ProposalManager" DROP CONSTRAINT "ProposalManager_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProposalManagerRole" DROP CONSTRAINT "ProposalManagerRole_permissionsId_fkey";

-- DropForeignKey
ALTER TABLE "_ProposalChoiceToVote" DROP CONSTRAINT "_ProposalChoiceToVote_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProposalChoiceToVote" DROP CONSTRAINT "_ProposalChoiceToVote_B_fkey";

-- AlterTable
ALTER TABLE "ManagerPermissions" DROP COLUMN "canEditAvailableChoices",
DROP COLUMN "canEditVoteChoices",
ADD COLUMN     "canEditCandidates" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditVotes" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "ProposalChoice";

-- DropTable
DROP TABLE "ProposalManager";

-- DropTable
DROP TABLE "ProposalManagerRole";

-- DropTable
DROP TABLE "_ProposalChoiceToVote";

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "proposalId" TEXT NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerRole" (
    "id" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "description" TEXT,
    "permissionsId" TEXT NOT NULL,

    CONSTRAINT "ManagerRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "id" TEXT NOT NULL,
    "ManagerRoleId" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CandidateToVote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_value_proposalId_key" ON "Candidate"("value", "proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "_CandidateToVote_AB_unique" ON "_CandidateToVote"("A", "B");

-- CreateIndex
CREATE INDEX "_CandidateToVote_B_index" ON "_CandidateToVote"("B");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerRole" ADD CONSTRAINT "ManagerRole_permissionsId_fkey" FOREIGN KEY ("permissionsId") REFERENCES "ManagerPermissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_ManagerRoleId_fkey" FOREIGN KEY ("ManagerRoleId") REFERENCES "ManagerRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToVote" ADD CONSTRAINT "_CandidateToVote_A_fkey" FOREIGN KEY ("A") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToVote" ADD CONSTRAINT "_CandidateToVote_B_fkey" FOREIGN KEY ("B") REFERENCES "Vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
