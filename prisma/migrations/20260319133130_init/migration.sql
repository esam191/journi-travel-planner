/*
  Warnings:

  - You are about to drop the column `image` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "image",
DROP COLUMN "imageUrl";
