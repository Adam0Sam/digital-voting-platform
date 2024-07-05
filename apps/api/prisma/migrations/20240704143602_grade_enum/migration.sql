/*
  Warnings:

  - The `grade` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('IA', 'IB', 'IC', 'ID', 'IE', 'IIA', 'IIB', 'IIC', 'IID', 'IIE', 'IIIA', 'IIIB', 'IIIC', 'IIID', 'TB1', 'IVA', 'IVB', 'IVC', 'IVD', 'TB2');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "grade",
ADD COLUMN     "grade" "Grade";
