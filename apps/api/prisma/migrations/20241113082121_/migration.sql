/*
  Warnings:

  - The values [INSTANT_RUNOFF] on the enum `VotingSystem` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VotingSystem_new" AS ENUM ('FIRST_PAST_THE_POST', 'RANKED_CHOICE', 'ABSOLUTE_MAJORITY');
ALTER TABLE "Proposal" ALTER COLUMN "votingSystem" TYPE "VotingSystem_new" USING ("votingSystem"::text::"VotingSystem_new");
ALTER TYPE "VotingSystem" RENAME TO "VotingSystem_old";
ALTER TYPE "VotingSystem_new" RENAME TO "VotingSystem";
DROP TYPE "VotingSystem_old";
COMMIT;
