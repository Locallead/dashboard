-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "theme" TEXT NOT NULL DEFAULT '1';

-- CreateTable
CREATE TABLE "HomePage" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "HomePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSection" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "subheading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "HeroSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USP" (
    "id" TEXT NOT NULL,
    "title1" TEXT NOT NULL,
    "title2" TEXT NOT NULL,
    "title3" TEXT NOT NULL,
    "description1" TEXT NOT NULL,
    "description2" TEXT NOT NULL,
    "description3" TEXT NOT NULL,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "USP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PictureLeft" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "subheading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "PictureLeft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "ServiceSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "quality1" TEXT NOT NULL,
    "quality2" TEXT NOT NULL,
    "quality3" TEXT NOT NULL,
    "quality4" TEXT NOT NULL,
    "quality5" TEXT NOT NULL,
    "quality6" TEXT NOT NULL,
    "description1" TEXT NOT NULL,
    "description2" TEXT NOT NULL,
    "description3" TEXT NOT NULL,
    "description4" TEXT NOT NULL,
    "description5" TEXT NOT NULL,
    "description6" TEXT NOT NULL,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "TrustSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "test1" TEXT NOT NULL,
    "user1" TEXT NOT NULL,
    "test2" TEXT NOT NULL,
    "user2" TEXT NOT NULL,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "MapSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CTA" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "linkText" TEXT NOT NULL,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "CTA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_businessId_key" ON "HomePage"("businessId");

-- AddForeignKey
ALTER TABLE "HomePage" ADD CONSTRAINT "HomePage_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroSection" ADD CONSTRAINT "HeroSection_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USP" ADD CONSTRAINT "USP_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PictureLeft" ADD CONSTRAINT "PictureLeft_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSection" ADD CONSTRAINT "ServiceSection_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustSection" ADD CONSTRAINT "TrustSection_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapSection" ADD CONSTRAINT "MapSection_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CTA" ADD CONSTRAINT "CTA_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
