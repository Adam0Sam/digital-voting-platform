-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER', 'PARENT', 'ADMIN', 'SUPER_ADMIN', 'GUEST');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VoteStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstNames" TEXT[],
    "lastName" TEXT NOT NULL,
    "grade" TEXT,
    "roles" "UserRole"[] DEFAULT ARRAY['GUEST']::"UserRole"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVote" (
    "id" TEXT NOT NULL,
    "status" "VoteStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,

    CONSTRAINT "UserVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_firstNames_lastName_idx" ON "User"("firstNames", "lastName");

-- CreateIndex
CREATE UNIQUE INDEX "User_firstNames_lastName_key" ON "User"("firstNames", "lastName");

-- AddForeignKey
ALTER TABLE "UserVote" ADD CONSTRAINT "UserVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVote" ADD CONSTRAINT "UserVote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
