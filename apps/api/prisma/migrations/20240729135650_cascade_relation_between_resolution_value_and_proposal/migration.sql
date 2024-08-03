-- DropForeignKey
ALTER TABLE "ProposalResolutionValue" DROP CONSTRAINT "ProposalResolutionValue_proposalId_fkey";

-- AddForeignKey
ALTER TABLE "ProposalResolutionValue" ADD CONSTRAINT "ProposalResolutionValue_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
