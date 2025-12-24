/*
  Warnings:

  - You are about to alter the column `name` on the `Games` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - A unique constraint covering the columns `[name]` on the table `Games` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Games" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "Games_name_key" ON "Games"("name");
