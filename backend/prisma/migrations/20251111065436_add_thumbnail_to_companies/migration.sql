/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `mkstudio_posts` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `videos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "mkstudio_posts" DROP COLUMN "thumbnail";

-- AlterTable
ALTER TABLE "videos" DROP COLUMN "thumbnail";
