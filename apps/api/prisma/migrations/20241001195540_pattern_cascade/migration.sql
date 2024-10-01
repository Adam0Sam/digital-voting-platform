-- DropForeignKey
ALTER TABLE "UserPattern" DROP CONSTRAINT "UserPattern_proposalId_fkey";

-- AddForeignKey
ALTER TABLE "UserPattern" ADD CONSTRAINT "UserPattern_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
