-- CreateEnum
CREATE TYPE "ProposalVisibility" AS ENUM ('PUBLIC', 'AGENT_ONLY', 'MANAGER_ONLY');

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "visibility" "ProposalVisibility" NOT NULL DEFAULT 'AGENT_ONLY';
