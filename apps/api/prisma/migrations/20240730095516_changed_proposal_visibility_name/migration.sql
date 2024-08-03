/*
  Warnings:

  - The `visibility` column on the `Proposal` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProposalVisibility" AS ENUM ('PUBLIC', 'RESTRICTED', 'MANAGER_ONLY');

-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "ProposalVisibility" NOT NULL DEFAULT 'RESTRICTED';

-- DropEnum
DROP TYPE "Visibility";
