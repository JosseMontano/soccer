/*
  Warnings:

  - You are about to drop the column `clubId` on the `Player` table. All the data in the column will be lost.
  - Changed the type of `birthdate` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_clubId_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "clubId",
DROP COLUMN "birthdate",
ADD COLUMN     "birthdate" TIMESTAMP(3) NOT NULL;
