-- DropIndex
DROP INDEX "User_firstNames_lastName_idx";

-- CreateIndex
CREATE INDEX "User_firstNames_lastName_id_idx" ON "User"("firstNames", "lastName", "id");
