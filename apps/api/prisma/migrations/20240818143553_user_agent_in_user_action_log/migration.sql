-- DropForeignKey
ALTER TABLE "UserActionLog" DROP CONSTRAINT "UserActionLog_userId_fkey";

-- AlterTable
ALTER TABLE "UserActionLog" ADD COLUMN     "userAgent" TEXT;

-- AddForeignKey
ALTER TABLE "UserActionLog" ADD CONSTRAINT "UserActionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
