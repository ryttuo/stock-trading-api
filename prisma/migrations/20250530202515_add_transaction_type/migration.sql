/*
  Warnings:

  - Added the required column `type` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL');

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "type" "TransactionType" NOT NULL;
