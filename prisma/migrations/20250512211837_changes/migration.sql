/*
  Warnings:

  - You are about to drop the `CTA` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HeroSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MapSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PictureLeft` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Testimonial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrustSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `USP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CTA" DROP CONSTRAINT "CTA_homePageId_fkey";

-- DropForeignKey
ALTER TABLE "HeroSection" DROP CONSTRAINT "HeroSection_homePageId_fkey";

-- DropForeignKey
ALTER TABLE "MapSection" DROP CONSTRAINT "MapSection_homePageId_fkey";

-- DropForeignKey
ALTER TABLE "PictureLeft" DROP CONSTRAINT "PictureLeft_homePageId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceSection" DROP CONSTRAINT "ServiceSection_homePageId_fkey";

-- DropForeignKey
ALTER TABLE "Testimonial" DROP CONSTRAINT "Testimonial_homePageId_fkey";

-- DropForeignKey
ALTER TABLE "TrustSection" DROP CONSTRAINT "TrustSection_homePageId_fkey";

-- DropForeignKey
ALTER TABLE "USP" DROP CONSTRAINT "USP_homePageId_fkey";

-- DropTable
DROP TABLE "CTA";

-- DropTable
DROP TABLE "HeroSection";

-- DropTable
DROP TABLE "MapSection";

-- DropTable
DROP TABLE "PictureLeft";

-- DropTable
DROP TABLE "ServiceSection";

-- DropTable
DROP TABLE "Testimonial";

-- DropTable
DROP TABLE "TrustSection";

-- DropTable
DROP TABLE "USP";

-- CreateTable
CREATE TABLE "HomePageSection" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "HomePageSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HomePageSection" ADD CONSTRAINT "HomePageSection_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
