-- AlterEnum
ALTER TYPE "Grade" ADD VALUE 'NONE';

-- DropIndex
DROP INDEX "User_personalNames_familyName_id_idx";

-- CreateIndex
CREATE INDEX "User_personalNames_familyName_grade_idx" ON "User"("personalNames", "familyName", "grade");
