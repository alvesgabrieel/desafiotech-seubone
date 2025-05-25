import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const cortes = await db.cutOut.findMany({
      select: {
        id: true,
        key: true,
        sku: true,
        tipoProduto: true,
        ordemDeExibição: true,
        status: true,
        tipoRecorte: true,
        posicaoRecorte: true,
        materialRecorte: true,
        corMaterial: true,
        imageURL: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(cortes, { status: 200 });
  } catch (err) {
    console.error("Erro ao buscar cliente:", err);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
