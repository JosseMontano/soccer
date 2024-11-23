/*
  Warnings:

  - You are about to drop the column `typeCategoriesId` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `amountGoalsFirstTeam` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `amountGoalsSecondTeam` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `cardsRed` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `cardsYellow` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `faults` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `firstDate` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `firstTeam` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `secondDate` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `secondTeam` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `allcardsRed` on the `HistoryPlayer` table. All the data in the column will be lost.
  - You are about to drop the column `allcardsYellow` on the `HistoryPlayer` table. All the data in the column will be lost.
  - You are about to drop the column `allfaults` on the `HistoryPlayer` table. All the data in the column will be lost.
  - You are about to drop the column `allgoals` on the `HistoryPlayer` table. All the data in the column will be lost.
  - You are about to drop the column `payInscription` on the `HistoryPlayer` table. All the data in the column will be lost.
  - You are about to drop the column `Ci` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `TyperOfPass` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Format` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playerId,active]` on the table `HistoryPlayer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Tournaments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `TypeCategories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `maxAge` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minAge` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeCategoryId` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Format` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `date` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstTeamId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondTeamId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Made the column `tournamentId` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `startDate` to the `HistoryPlayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Tournaments` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Tournaments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `formatId` on table `Tournaments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `TypeCategories` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_typeCategoriesId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "HistoryPlayer" DROP CONSTRAINT "HistoryPlayer_typeOfPassId_fkey";

-- DropForeignKey
ALTER TABLE "Tournaments" DROP CONSTRAINT "Tournaments_formatId_fkey";

-- DropIndex
DROP INDEX "HistoryPlayer_clubId_playerId_typeOfPassId_key";

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "typeCategoriesId",
ADD COLUMN     "maxAge" INTEGER NOT NULL,
ADD COLUMN     "minAge" INTEGER NOT NULL,
ADD COLUMN     "typeCategoryId" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "logo" TEXT;

-- AlterTable
ALTER TABLE "Format" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "amountGoalsFirstTeam",
DROP COLUMN "amountGoalsSecondTeam",
DROP COLUMN "cardsRed",
DROP COLUMN "cardsYellow",
DROP COLUMN "faults",
DROP COLUMN "firstDate",
DROP COLUMN "firstTeam",
DROP COLUMN "secondDate",
DROP COLUMN "secondTeam",
DROP COLUMN "winner",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "firstTeamId" TEXT NOT NULL,
ADD COLUMN     "foulsFirstTeam" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "foulsSecondTeam" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goalsFirstTeam" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goalsSecondTeam" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "redCardsFirstTeam" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "redCardsSecondTeam" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "secondTeamId" TEXT NOT NULL,
ADD COLUMN     "winnerId" TEXT,
ADD COLUMN     "yellowCardsFirstTeam" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "yellowCardsSecondTeam" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "tournamentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "HistoryPlayer" DROP COLUMN "allcardsRed",
DROP COLUMN "allcardsYellow",
DROP COLUMN "allfaults",
DROP COLUMN "allgoals",
DROP COLUMN "payInscription",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "goals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "redCards" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "yellowCards" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "Ci",
DROP COLUMN "age",
ALTER COLUMN "commet" DROP NOT NULL,
ALTER COLUMN "commet" SET DATA TYPE TEXT,
ALTER COLUMN "photo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tournaments" ADD COLUMN     "categoryId" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "formatId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TypeCategories" ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "TyperOfPass";

-- CreateTable
CREATE TABLE "Roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeOfPass" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TypeOfPass_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_name_key" ON "Roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TypeOfPass_name_key" ON "TypeOfPass"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Format_name_key" ON "Format"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HistoryPlayer_playerId_active_key" ON "HistoryPlayer"("playerId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "Tournaments_name_key" ON "Tournaments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TypeCategories_name_key" ON "TypeCategories"("name");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_typeCategoryId_fkey" FOREIGN KEY ("typeCategoryId") REFERENCES "TypeCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryPlayer" ADD CONSTRAINT "HistoryPlayer_typeOfPassId_fkey" FOREIGN KEY ("typeOfPassId") REFERENCES "TypeOfPass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "Format"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
