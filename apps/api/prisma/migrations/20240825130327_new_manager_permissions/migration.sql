/*
  Warnings:

  - You are about to drop the column `canEditChoices` on the `ManagerPermissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ManagerPermissions" DROP COLUMN "canEditChoices",
ADD COLUMN     "canEditAvailableChoices" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditVoteChoices" BOOLEAN NOT NULL DEFAULT false;
