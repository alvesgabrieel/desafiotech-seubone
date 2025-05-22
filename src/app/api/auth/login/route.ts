import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    const { username, senha } = await request.json();

    const user = await db.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: "JWT_SECRET não configurado." },
        { status: 500 },
      );
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "10h" },
    );

    return NextResponse.json(
      { token, user: { name: user.username } },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
  }
}
