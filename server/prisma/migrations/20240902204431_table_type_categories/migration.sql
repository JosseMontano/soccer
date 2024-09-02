-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "typeCategoriesId" TEXT;

-- CreateTable
CREATE TABLE "TypeCategories" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "TypeCategories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_typeCategoriesId_fkey" FOREIGN KEY ("typeCategoriesId") REFERENCES "TypeCategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
