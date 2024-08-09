-- DropForeignKey
ALTER TABLE "ProposalManagerRole" DROP CONSTRAINT "ProposalManagerRole_permissionsId_fkey";

-- AddForeignKey
ALTER TABLE "ProposalManagerRole" ADD CONSTRAINT "ProposalManagerRole_permissionsId_fkey" FOREIGN KEY ("permissionsId") REFERENCES "ManagerPermissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
