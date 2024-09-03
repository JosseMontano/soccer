-- CreateTable
CREATE TABLE "HistoryPlayer" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "typeOfPassId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "allgoals" INTEGER,
    "allfaults" INTEGER,
    "allcardsYellow" INTEGER,
    "allcardsRed" INTEGER,
    "payInscription" BOOLEAN NOT NULL,

    CONSTRAINT "HistoryPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoryPlayer_clubId_playerId_typeOfPassId_key" ON "HistoryPlayer"("clubId", "playerId", "typeOfPassId");

-- AddForeignKey
ALTER TABLE "HistoryPlayer" ADD CONSTRAINT "HistoryPlayer_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryPlayer" ADD CONSTRAINT "HistoryPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryPlayer" ADD CONSTRAINT "HistoryPlayer_typeOfPassId_fkey" FOREIGN KEY ("typeOfPassId") REFERENCES "TyperOfPass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
