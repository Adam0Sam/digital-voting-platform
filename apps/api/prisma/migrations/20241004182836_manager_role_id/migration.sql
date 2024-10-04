/*
  Warnings:

  - You are about to drop the column `ManagerRoleId` on the `Manager` table. All the data in the column will be lost.
  - Added the required column `managerRoleId` to the `Manager` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_ManagerRoleId_fkey";

-- AlterTable
ALTER TABLE "Manager" DROP COLUMN "ManagerRoleId",
ADD COLUMN     "managerRoleId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_managerRoleId_fkey" FOREIGN KEY ("managerRoleId") REFERENCES "ManagerRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
