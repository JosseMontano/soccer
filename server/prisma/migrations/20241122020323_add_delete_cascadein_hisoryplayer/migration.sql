-- DropForeignKey
ALTER TABLE "HistoryPlayer" DROP CONSTRAINT "HistoryPlayer_playerId_fkey";

-- AddForeignKey
ALTER TABLE "HistoryPlayer" ADD CONSTRAINT "HistoryPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
