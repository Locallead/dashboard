/*
  Warnings:

  - You are about to drop the column `servicePages` on the `Business` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "servicePages",
ADD COLUMN     "locationPages" JSONB DEFAULT '[]';
