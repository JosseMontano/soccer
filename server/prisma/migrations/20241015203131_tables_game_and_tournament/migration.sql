-- CreateTable
CREATE TABLE "Tournaments" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "formatId" TEXT,

    CONSTRAINT "Tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "firstTeam" TEXT,
    "secondTeam" TEXT,
    "firstDate" TIMESTAMP(3),
    "secondDate" TIMESTAMP(3),
    "cardsYellow" INTEGER,
    "cardsRed" INTEGER,
    "faults" INTEGER,
    "amountGoalsFirstTeam" INTEGER,
    "amountGoalsSecondTeam" INTEGER,
    "winner" TEXT,
    "tournamentId" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "Format"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
