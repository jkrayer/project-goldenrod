-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DM', 'PLAYER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PLAYER';
