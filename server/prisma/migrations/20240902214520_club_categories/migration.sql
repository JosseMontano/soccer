-- CreateTable
CREATE TABLE "ClubCategories" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ClubCategories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClubCategories_clubId_categoryId_key" ON "ClubCategories"("clubId", "categoryId");

-- AddForeignKey
ALTER TABLE "ClubCategories" ADD CONSTRAINT "ClubCategories_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubCategories" ADD CONSTRAINT "ClubCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
