/*
  Warnings:

  - You are about to drop the `HomePageSection` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sections` to the `HomePage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "HomePageSection" DROP CONSTRAINT "HomePageSection_homePageId_fkey";

-- AlterTable
ALTER TABLE "HomePage" ADD COLUMN     "sections" JSONB NOT NULL;

-- DropTable
DROP TABLE "HomePageSection";
