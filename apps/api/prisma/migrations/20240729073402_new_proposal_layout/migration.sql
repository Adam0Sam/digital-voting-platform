/*
  Warnings:

  - The values [APPROVED,REJECTED] on the enum `ProposalStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `UserVote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `proposalResolutionValueId` to the `UserVote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserVoteStatus" AS ENUM ('PENDING', 'RESOLVED');

-- AlterEnum
BEGIN;
CREATE TYPE "ProposalStatus_new" AS ENUM ('PENDING', 'RESOLVED', 'ABORTED');
ALTER TABLE "Proposal" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Proposal" ALTER COLUMN "status" TYPE "ProposalStatus_new" USING ("status"::text::"ProposalStatus_new");
ALTER TYPE "ProposalStatus" RENAME TO "ProposalStatus_old";
ALTER TYPE "ProposalStatus_new" RENAME TO "ProposalStatus";
DROP TYPE "ProposalStatus_old";
ALTER TABLE "Proposal" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "UserVote" ADD COLUMN     "proposalResolutionValueId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "UserVoteStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "VoteStatus";

-- CreateTable
CREATE TABLE "ProposalResolutionValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,

    CONSTRAINT "ProposalResolutionValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserVote" ADD CONSTRAINT "UserVote_proposalResolutionValueId_fkey" FOREIGN KEY ("proposalResolutionValueId") REFERENCES "ProposalResolutionValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalResolutionValue" ADD CONSTRAINT "ProposalResolutionValue_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
