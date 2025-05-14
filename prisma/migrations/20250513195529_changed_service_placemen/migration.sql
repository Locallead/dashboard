/*
  Warnings:

  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_businessId_fkey";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "services" JSONB DEFAULT '[]';

-- DropTable
DROP TABLE "Service";
