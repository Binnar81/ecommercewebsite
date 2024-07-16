/*
  Warnings:

  - A unique constraint covering the columns `[userId,categoryId]` on the table `Interest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Interest_userId_categoryId_key" ON "Interest"("userId", "categoryId");
