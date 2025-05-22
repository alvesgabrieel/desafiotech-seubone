import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { username, email, senha } = await request.json();

    const existingUser = await db.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Usuário já existe",
          message: "Este email ou usuário já está cadastrado",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await db.user.create({
      data: { username, senha: hashedPassword, email },
    });

    return NextResponse.json(
      { message: "Usuário criado com sucesso!", user },
      { status: 201 },
    );
  } catch (err) {
    console.error(`Erro ao salvar usuário no banco de dados:`, err);
    return NextResponse.json(
      {
        error: "Erro no servidor.",
        message: "Não foi possível criar sua conta. Tente novamente.",
      },
      { status: 500 },
    );
  }
}
