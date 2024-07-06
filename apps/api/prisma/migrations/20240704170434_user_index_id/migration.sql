-- DropIndex
DROP INDEX "User_firstNames_familyName_idx";

-- CreateIndex
CREATE INDEX "User_firstNames_familyName_id_idx" ON "User"("firstNames", "familyName", "id");
