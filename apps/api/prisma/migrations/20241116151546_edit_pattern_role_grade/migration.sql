/*
  Warnings:

  - The values [EDIT_USER_PATTERN] on the enum `UserActions` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserActions_new" AS ENUM ('SIGNUP', 'SIGNIN', 'CREATE_PROPOSAL', 'EDIT_START_END_DATES', 'EDIT_RESOLUTION_DATE', 'MANUALLY_RESOLVE_PROPOSAL', 'EDIT_TITLE', 'EDIT_DESCRIPTION', 'EDIT_STATUS', 'EDIT_VISIBILITY', 'REMOVE_CANDIDATE', 'ADD_CANDIDATE', 'EDIT_CHOICE_COUNT', 'EDIT_PATTERN_GRADE', 'EDIT_PATTERN_ROLE');
ALTER TABLE "UserActionLog" ALTER COLUMN "action" TYPE "UserActions_new" USING ("action"::text::"UserActions_new");
ALTER TYPE "UserActions" RENAME TO "UserActions_old";
ALTER TYPE "UserActions_new" RENAME TO "UserActions";
DROP TYPE "UserActions_old";
COMMIT;
