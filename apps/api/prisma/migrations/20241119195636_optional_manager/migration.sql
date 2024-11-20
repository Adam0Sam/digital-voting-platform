-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "suggestedManagerId" DROP NOT NULL,
ALTER COLUMN "suggestedManagerId" DROP DEFAULT;
