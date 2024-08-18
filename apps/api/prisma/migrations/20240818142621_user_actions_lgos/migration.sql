/*
  Warnings:

  - Added the required column `action` to the `UserActionLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserActions" AS ENUM ('SIGNUP', 'SIGNIN', 'CREATE_PROPOSAL', 'EDIT_PROPOSAL', 'DELETE_PROPOSAL', 'VOTE', 'EDIT_VOTE', 'DELETE_VOTE', 'CREATE_MANAGER', 'EDIT_MANAGER', 'DELETE_MANAGER', 'CREATE_PERMISSIONS', 'EDIT_PERMISSIONS', 'DELETE_PERMISSIONS');

-- AlterTable
ALTER TABLE "UserActionLog" ADD COLUMN     "action" "UserActions" NOT NULL;
