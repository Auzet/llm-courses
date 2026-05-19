/*
  Warnings:

  - You are about to drop the column `userId` on the `StudyPlan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudyPlan" DROP CONSTRAINT "StudyPlan_userId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_userId_fkey";

-- AlterTable
ALTER TABLE "StudyPlan" DROP COLUMN "userId";
