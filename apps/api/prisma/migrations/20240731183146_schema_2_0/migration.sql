/*
  Warnings:

  - You are about to drop the column `visibility` on the `Proposal` table. All the data in the column will be lost.
  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProposalResolutionValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserVote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Owners` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProposalResolutionValueToUserVote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Reviewers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[personalNames,familyName,grade]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `description` on table `Proposal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `grade` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ProposalManagerRole" AS ENUM ('OWNER', 'REVIEWER');

-- CreateEnum
CREATE TYPE "VoteStatus" AS ENUM ('PENDING', 'RESOLVED');

-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProposalResolutionValue" DROP CONSTRAINT "ProposalResolutionValue_proposalId_fkey";

-- DropForeignKey
ALTER TABLE "UserVote" DROP CONSTRAINT "UserVote_proposalId_fkey";

-- DropForeignKey
ALTER TABLE "UserVote" DROP CONSTRAINT "UserVote_userId_fkey";

-- DropForeignKey
ALTER TABLE "_Owners" DROP CONSTRAINT "_Owners_A_fkey";

-- DropForeignKey
ALTER TABLE "_Owners" DROP CONSTRAINT "_Owners_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProposalResolutionValueToUserVote" DROP CONSTRAINT "_ProposalResolutionValueToUserVote_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProposalResolutionValueToUserVote" DROP CONSTRAINT "_ProposalResolutionValueToUserVote_B_fkey";

-- DropForeignKey
ALTER TABLE "_Reviewers" DROP CONSTRAINT "_Reviewers_A_fkey";

-- DropForeignKey
ALTER TABLE "_Reviewers" DROP CONSTRAINT "_Reviewers_B_fkey";

-- DropIndex
DROP INDEX "User_personalNames_familyName_key";

-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "visibility",
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "choiceCount" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roles" DROP DEFAULT,
ALTER COLUMN "grade" SET NOT NULL;

-- DropTable
DROP TABLE "Log";

-- DropTable
DROP TABLE "ProposalResolutionValue";

-- DropTable
DROP TABLE "UserVote";

-- DropTable
DROP TABLE "_Owners";

-- DropTable
DROP TABLE "_ProposalResolutionValueToUserVote";

-- DropTable
DROP TABLE "_Reviewers";

-- DropEnum
DROP TYPE "ProposalVisibility";

-- DropEnum
DROP TYPE "UserVoteStatus";

-- CreateTable
CREATE TABLE "ProposalChoice" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "proposalId" TEXT NOT NULL,

    CONSTRAINT "ProposalChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalManager" (
    "id" TEXT NOT NULL,
    "role" "ProposalManagerRole" NOT NULL,
    "proposalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ProposalManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "status" "VoteStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActionLog" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProposalChoiceToVote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProposalChoiceToVote_AB_unique" ON "_ProposalChoiceToVote"("A", "B");

-- CreateIndex
CREATE INDEX "_ProposalChoiceToVote_B_index" ON "_ProposalChoiceToVote"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_personalNames_familyName_grade_key" ON "User"("personalNames", "familyName", "grade");

-- AddForeignKey
ALTER TABLE "ProposalChoice" ADD CONSTRAINT "ProposalChoice_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalManager" ADD CONSTRAINT "ProposalManager_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalManager" ADD CONSTRAINT "ProposalManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActionLog" ADD CONSTRAINT "UserActionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProposalChoiceToVote" ADD CONSTRAINT "_ProposalChoiceToVote_A_fkey" FOREIGN KEY ("A") REFERENCES "ProposalChoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProposalChoiceToVote" ADD CONSTRAINT "_ProposalChoiceToVote_B_fkey" FOREIGN KEY ("B") REFERENCES "Vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
