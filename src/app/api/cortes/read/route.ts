import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const cortes = await db.cutOut.findMany({
      select: {
        key: true,
        sku: true,
        tipoProduto: true,
        ordemDeExibição: true,
        status: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json(cortes, { status: 200 });
  } catch (err) {
    console.error("Erro ao buscar cliente:", err);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
