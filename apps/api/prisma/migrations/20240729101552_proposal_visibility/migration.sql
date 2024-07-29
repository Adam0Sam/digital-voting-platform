-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'RESTRICTED', 'MANAGER_ONLY');

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC';
