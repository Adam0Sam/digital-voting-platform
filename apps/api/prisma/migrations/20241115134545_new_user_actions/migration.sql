/*
  Warnings:

  - The values [AUTH_ATTEMPT,DELETE_PROPOSAL,VOTE,EDIT_VOTE,DELETE_VOTE] on the enum `UserActions` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserActions_new" AS ENUM ('SIGNUP', 'SIGNIN', 'CREATE_PROPOSAL', 'EDIT_START_END_DATES', 'EDIT_RESOLUTION_DATE', 'MANUALLY_RESOLVE_PROPOSAL', 'EDIT_TITLE', 'EDIT_DESCRIPTION');
ALTER TABLE "UserActionLog" ALTER COLUMN "action" TYPE "UserActions_new" USING ("action"::text::"UserActions_new");
ALTER TYPE "UserActions" RENAME TO "UserActions_old";
ALTER TYPE "UserActions_new" RENAME TO "UserActions";
DROP TYPE "UserActions_old";
COMMIT;
