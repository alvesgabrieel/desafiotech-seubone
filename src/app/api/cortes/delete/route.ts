import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

export async function DELETE(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                error: "Dados inválidos.",
                message: "O ID do registro não localizado",
                },
                { status: 400 },
            );
        }

        const existingRegistro = await db.cutOut.findUnique({
            where: { id: id }
        })

        if (!existingRegistro) {
            return NextResponse.json(
                {
                    error: "Registro não localizado",
                    message: "O registro que você está tentando excluir não existe"
                },
                {
                    status: 404
                }
            )
        }

        await db.cutOut.delete({
            where: {id: id}
        })

        return NextResponse.json(
            {
                message: "Registro excluído com sucesso.",
                deletedRegistro: existingRegistro,
            },
            { status: 200 },
        );

    } catch (err){
        console.error(`Erro ao excluir hospedagem:`, err);
        return NextResponse.json(
        {
            error: "Erro no servidor.",
            message: "Não foi possível excluir a hospedagem. Tente novamente.",
        },
        { status: 500 },
        );
    }
}
