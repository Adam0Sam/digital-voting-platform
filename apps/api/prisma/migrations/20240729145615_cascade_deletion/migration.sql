/*
  Warnings:

  - The values [DRAFT] on the enum `ProposalStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProposalStatus_new" AS ENUM ('PENDING', 'ACTIVE', 'RESOLVED', 'ABORTED');
ALTER TABLE "Proposal" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Proposal" ALTER COLUMN "status" TYPE "ProposalStatus_new" USING ("status"::text::"ProposalStatus_new");
ALTER TYPE "ProposalStatus" RENAME TO "ProposalStatus_old";
ALTER TYPE "ProposalStatus_new" RENAME TO "ProposalStatus";
DROP TYPE "ProposalStatus_old";
ALTER TABLE "Proposal" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "UserVote" DROP CONSTRAINT "UserVote_proposalId_fkey";

-- AlterTable
ALTER TABLE "Proposal" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "UserVote" ADD CONSTRAINT "UserVote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
