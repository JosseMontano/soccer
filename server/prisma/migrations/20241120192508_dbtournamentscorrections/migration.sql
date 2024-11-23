-- DropIndex
DROP INDEX "Tournaments_name_key";

-- AlterTable
ALTER TABLE "Tournaments" ADD COLUMN     "description" TEXT,
ADD COLUMN     "finalFormatId" TEXT,
ADD COLUMN     "fixtureGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pendiente';

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_finalFormatId_fkey" FOREIGN KEY ("finalFormatId") REFERENCES "Format"("id") ON DELETE SET NULL ON UPDATE CASCADE;
