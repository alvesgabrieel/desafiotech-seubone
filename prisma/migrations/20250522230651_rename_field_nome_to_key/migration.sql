/*
  Warnings:

  - You are about to drop the column `nome` on the `CutOut` table. All the data in the column will be lost.
  - Added the required column `key` to the `CutOut` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CutOut" DROP COLUMN "nome",
ADD COLUMN     "key" TEXT NOT NULL;
