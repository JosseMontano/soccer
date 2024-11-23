/*
  Warnings:

  - A unique constraint covering the columns `[playerId,clubId,typeOfPassId]` on the table `HistoryPlayer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "HistoryPlayer_playerId_active_key";

-- AlterTable
ALTER TABLE "HistoryPlayer" ALTER COLUMN "active" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "HistoryPlayer_playerId_clubId_typeOfPassId_key" ON "HistoryPlayer"("playerId", "clubId", "typeOfPassId");
