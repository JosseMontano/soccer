-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_typeCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "ClubCategories" DROP CONSTRAINT "ClubCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ClubCategories" DROP CONSTRAINT "ClubCategories_clubId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_firstTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_secondTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_winnerId_fkey";

-- CreateTable
CREATE TABLE "TournamentClub" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,

    CONSTRAINT "TournamentClub_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_typeCategoryId_fkey" FOREIGN KEY ("typeCategoryId") REFERENCES "TypeCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubCategories" ADD CONSTRAINT "ClubCategories_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubCategories" ADD CONSTRAINT "ClubCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentClub" ADD CONSTRAINT "TournamentClub_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentClub" ADD CONSTRAINT "TournamentClub_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_firstTeamId_fkey" FOREIGN KEY ("firstTeamId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_secondTeamId_fkey" FOREIGN KEY ("secondTeamId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
