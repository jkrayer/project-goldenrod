/*
  Warnings:

  - You are about to alter the column `userName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userName" DROP NOT NULL,
ALTER COLUMN "userName" SET DATA TYPE VARCHAR(30);
