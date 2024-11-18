/*
  Warnings:

  - You are about to drop the column `content` on the `UserNotification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `UserNotification` table. All the data in the column will be lost.
  - Added the required column `userNotificationPackageId` to the `UserNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserNotification" DROP COLUMN "content",
DROP COLUMN "type",
ADD COLUMN     "userNotificationPackageId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserNotificationPackage" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "content" JSONB NOT NULL,

    CONSTRAINT "UserNotificationPackage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_userNotificationPackageId_fkey" FOREIGN KEY ("userNotificationPackageId") REFERENCES "UserNotificationPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
