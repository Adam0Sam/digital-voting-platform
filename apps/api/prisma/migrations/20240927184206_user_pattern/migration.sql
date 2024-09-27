-- DropForeignKey
ALTER TABLE "ProposalManager" DROP CONSTRAINT "ProposalManager_proposalManagerRoleId_fkey";

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "userPatternId" TEXT;

-- CreateTable
CREATE TABLE "UserPattern" (
    "id" TEXT NOT NULL,
    "grades" "Grade"[],
    "roles" "UserRole"[],
    "proposalId" TEXT NOT NULL,

    CONSTRAINT "UserPattern_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPattern_proposalId_key" ON "UserPattern"("proposalId");

-- AddForeignKey
ALTER TABLE "UserPattern" ADD CONSTRAINT "UserPattern_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalManager" ADD CONSTRAINT "ProposalManager_proposalManagerRoleId_fkey" FOREIGN KEY ("proposalManagerRoleId") REFERENCES "ProposalManagerRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
