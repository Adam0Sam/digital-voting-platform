/*
  Warnings:

  - The values [CREATE_MANAGER,EDIT_MANAGER,DELETE_MANAGER,CREATE_PERMISSIONS,EDIT_PERMISSIONS,DELETE_PERMISSIONS] on the enum `UserActions` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `canEditVotes` on the `ManagerPermissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[personalNames,familyName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserActions_new" AS ENUM ('AUTH_ATTEMPT', 'SIGNUP', 'SIGNIN', 'CREATE_PROPOSAL', 'EDIT_PROPOSAL', 'DELETE_PROPOSAL', 'VOTE', 'EDIT_VOTE', 'DELETE_VOTE');
ALTER TABLE "UserActionLog" ALTER COLUMN "action" TYPE "UserActions_new" USING ("action"::text::"UserActions_new");
ALTER TYPE "UserActions" RENAME TO "UserActions_old";
ALTER TYPE "UserActions_new" RENAME TO "UserActions";
DROP TYPE "UserActions_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ManagerPermissions" DROP CONSTRAINT "ManagerPermissions_authorId_fkey";

-- DropIndex
DROP INDEX "User_personalNames_familyName_grade_idx";

-- DropIndex
DROP INDEX "User_personalNames_familyName_grade_key";

-- AlterTable
ALTER TABLE "ManagerPermissions" DROP COLUMN "canEditVotes",
ADD COLUMN     "canCreateVotes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canDeleteVotes" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "User_personalNames_familyName_idx" ON "User"("personalNames", "familyName");

-- CreateIndex
CREATE UNIQUE INDEX "User_personalNames_familyName_key" ON "User"("personalNames", "familyName");

-- AddForeignKey
ALTER TABLE "ManagerPermissions" ADD CONSTRAINT "ManagerPermissions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
