/*
  Warnings:

  - You are about to drop the column `guestFirstName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `guestLastName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `guestLocation` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `guestPhone` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "guestFirstName",
DROP COLUMN "guestLastName",
DROP COLUMN "guestLocation",
DROP COLUMN "guestPhone",
ADD COLUMN     "contactFirstName" TEXT,
ADD COLUMN     "contactLastName" TEXT,
ADD COLUMN     "contactLocation" TEXT,
ADD COLUMN     "contactPhone" TEXT;
