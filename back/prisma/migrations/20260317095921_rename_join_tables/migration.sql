/*
  Warnings:

  - You are about to drop the `book_author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `book_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_book` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "book_author" DROP CONSTRAINT "book_author_author_id_fkey";

-- DropForeignKey
ALTER TABLE "book_author" DROP CONSTRAINT "book_author_book_id_fkey";

-- DropForeignKey
ALTER TABLE "book_category" DROP CONSTRAINT "book_category_book_id_fkey";

-- DropForeignKey
ALTER TABLE "book_category" DROP CONSTRAINT "book_category_category_id_fkey";

-- DropForeignKey
ALTER TABLE "user_book" DROP CONSTRAINT "user_book_book_id_fkey";

-- DropForeignKey
ALTER TABLE "user_book" DROP CONSTRAINT "user_book_user_id_fkey";

-- DropTable
DROP TABLE "book_author";

-- DropTable
DROP TABLE "book_category";

-- DropTable
DROP TABLE "user_book";

-- CreateTable
CREATE TABLE "user_has_book" (
    "user_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "status" "ReadingStatus" NOT NULL DEFAULT 'to_read',

    CONSTRAINT "user_has_book_pkey" PRIMARY KEY ("user_id","book_id")
);

-- CreateTable
CREATE TABLE "book_has_author" (
    "book_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "book_has_author_pkey" PRIMARY KEY ("book_id","author_id")
);

-- CreateTable
CREATE TABLE "book_has_category" (
    "book_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "book_has_category_pkey" PRIMARY KEY ("book_id","category_id")
);

-- AddForeignKey
ALTER TABLE "user_has_book" ADD CONSTRAINT "user_has_book_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_has_book" ADD CONSTRAINT "user_has_book_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_has_author" ADD CONSTRAINT "book_has_author_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_has_author" ADD CONSTRAINT "book_has_author_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_has_category" ADD CONSTRAINT "book_has_category_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_has_category" ADD CONSTRAINT "book_has_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
