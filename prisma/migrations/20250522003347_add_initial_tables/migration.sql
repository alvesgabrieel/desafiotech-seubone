-- CreateEnum
CREATE TYPE "TipoRecorte" AS ENUM ('FRENTE', 'ABA', 'LATERAL');

-- CreateEnum
CREATE TYPE "Modelo" AS ENUM ('TRUCKER', 'AMERICANO');

-- CreateEnum
CREATE TYPE "Tecido" AS ENUM ('LINHO');

-- CreateEnum
CREATE TYPE "Cores" AS ENUM ('AZUL_MARINHO', 'LARANJA');

-- CreateEnum
CREATE TYPE "Posicao" AS ENUM ('FRENTE', 'TRASEIRA', 'LATERAL');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CutOut" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ordemDeExibição" INTEGER NOT NULL,
    "tipoRecorte" "TipoRecorte" NOT NULL,
    "posicaoRecorte" "Posicao" NOT NULL,
    "tipoProduto" "Modelo" NOT NULL,
    "materialRecorte" "Tecido" NOT NULL,
    "corMaterial" "Cores" NOT NULL,
    "status" "Status" NOT NULL,
    "imageURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CutOut_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CutOut_sku_key" ON "CutOut"("sku");
