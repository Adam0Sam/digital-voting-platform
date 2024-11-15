/*
  Warnings:

  - Added the required column `votingSystem` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VotingSystem" AS ENUM ('FIRST_PAST_THE_POST', 'INSTANT_RUNOFF', 'ABSOLUTE_MAJORITY');

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "votingSystem" "VotingSystem" NOT NULL;
