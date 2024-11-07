/*
  Warnings:

  - The values [SUCCESSFUL_SIGNIN,FAILED_SIGNIN] on the enum `UserActions` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserActions_new" AS ENUM ('AUTH_ATTEMPT', 'SIGNUP', 'SIGNIN', 'CREATE_PROPOSAL', 'EDIT_PROPOSAL', 'DELETE_PROPOSAL', 'VOTE', 'EDIT_VOTE', 'DELETE_VOTE');
ALTER TABLE "UserActionLog" ALTER COLUMN "action" TYPE "UserActions_new" USING ("action"::text::"UserActions_new");
ALTER TYPE "UserActions" RENAME TO "UserActions_old";
ALTER TYPE "UserActions_new" RENAME TO "UserActions";
DROP TYPE "UserActions_old";
COMMIT;
