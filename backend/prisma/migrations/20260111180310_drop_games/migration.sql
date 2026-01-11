/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Games` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGames` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Games" DROP CONSTRAINT "Games_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserGames" DROP CONSTRAINT "UserGames_gameId_fkey";

-- DropForeignKey
ALTER TABLE "UserGames" DROP CONSTRAINT "UserGames_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropTable
DROP TABLE "Games";

-- DropTable
DROP TABLE "UserGames";

-- DropEnum
DROP TYPE "Role";
