/*
  Warnings:

  - You are about to drop the column `slug` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Service` table. All the data in the column will be lost.
  - Added the required column `data` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "slug",
DROP COLUMN "title",
ADD COLUMN     "data" JSONB NOT NULL;
