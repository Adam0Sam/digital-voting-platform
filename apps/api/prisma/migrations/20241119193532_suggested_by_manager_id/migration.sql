-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "managerId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;
