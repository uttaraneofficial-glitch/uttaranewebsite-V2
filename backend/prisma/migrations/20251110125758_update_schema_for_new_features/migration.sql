/*
  Warnings:

  - The values [INTERVIEWER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `description` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `failedLoginAttempts` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLoginAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lockedUntil` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `interview_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_sessions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "interview_sessions" DROP CONSTRAINT "interview_sessions_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "interview_sessions" DROP CONSTRAINT "interview_sessions_companyId_fkey";

-- DropForeignKey
ALTER TABLE "interview_sessions" DROP CONSTRAINT "interview_sessions_interviewerId_fkey";

-- DropForeignKey
ALTER TABLE "user_sessions" DROP CONSTRAINT "user_sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_companyId_fkey";

-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "description",
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "orderIndex" INTEGER,
ADD COLUMN     "shortBio" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "companyId",
DROP COLUMN "email",
DROP COLUMN "failedLoginAttempts",
DROP COLUMN "lastLoginAt",
DROP COLUMN "lockedUntil",
DROP COLUMN "name",
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "videos" DROP COLUMN "description",
DROP COLUMN "duration",
DROP COLUMN "isPublished",
DROP COLUMN "thumbnailUrl",
DROP COLUMN "url",
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "roundType" TEXT,
ADD COLUMN     "youtubeId" TEXT;

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "interview_sessions";

-- DropTable
DROP TABLE "user_sessions";

-- DropEnum
DROP TYPE "InterviewStatus";

-- CreateTable
CREATE TABLE "ngo_posts" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ngo_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mkstudio_posts" (
    "id" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mkstudio_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_content" (
    "key" TEXT NOT NULL,
    "value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_content_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
