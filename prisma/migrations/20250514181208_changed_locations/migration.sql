/*
  Warnings:

  - You are about to drop the column `name` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Location` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "name",
DROP COLUMN "slug",
DROP COLUMN "state",
DROP COLUMN "zip",
ADD COLUMN     "locations" JSONB NOT NULL DEFAULT '[]';
