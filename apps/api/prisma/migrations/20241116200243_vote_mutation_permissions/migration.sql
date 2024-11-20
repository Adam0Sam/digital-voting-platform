/*
  Warnings:

  - You are about to drop the column `canCreateVotes` on the `ManagerPermissions` table. All the data in the column will be lost.
  - You are about to drop the column `canDeleteVotes` on the `ManagerPermissions` table. All the data in the column will be lost.
  - You are about to drop the column `canEditManagers` on the `ManagerPermissions` table. All the data in the column will be lost.
  - You are about to drop the column `canEditVotes` on the `ManagerPermissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ManagerPermissions" DROP COLUMN "canCreateVotes",
DROP COLUMN "canDeleteVotes",
DROP COLUMN "canEditManagers",
DROP COLUMN "canEditVotes",
ADD COLUMN     "canChangeVoteStatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditVotersList" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canOfferVoteSuggestions" BOOLEAN NOT NULL DEFAULT false;
