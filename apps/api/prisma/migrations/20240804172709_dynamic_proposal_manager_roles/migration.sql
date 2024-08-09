/*
  Warnings:

  - You are about to drop the column `role` on the `ProposalManager` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProposalManager" DROP COLUMN "role",
ADD COLUMN     "proposalManagerRoleId" TEXT;

-- DropEnum
DROP TYPE "ProposalManagerRole";

-- CreateTable
CREATE TABLE "ProposalManagerRole" (
    "id" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "permissionsId" TEXT NOT NULL,

    CONSTRAINT "ProposalManagerRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerPermissions" (
    "id" TEXT NOT NULL,
    "canEditTitle" BOOLEAN NOT NULL DEFAULT false,
    "canEditDescription" BOOLEAN NOT NULL DEFAULT false,
    "canEditDates" BOOLEAN NOT NULL DEFAULT false,
    "canEditStatus" BOOLEAN NOT NULL DEFAULT false,
    "canEditVisibility" BOOLEAN NOT NULL DEFAULT false,
    "canEditVotes" BOOLEAN NOT NULL DEFAULT false,
    "canEditManagers" BOOLEAN NOT NULL DEFAULT false,
    "canEditChoices" BOOLEAN NOT NULL DEFAULT false,
    "canEditChoiceCount" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ManagerPermissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProposalManagerRole" ADD CONSTRAINT "ProposalManagerRole_permissionsId_fkey" FOREIGN KEY ("permissionsId") REFERENCES "ManagerPermissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalManager" ADD CONSTRAINT "ProposalManager_proposalManagerRoleId_fkey" FOREIGN KEY ("proposalManagerRoleId") REFERENCES "ProposalManagerRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
