import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function extractPublicIdFromUrl(url: string): string | null {
  try {
    const urlParts = url.split("/");
    const lastPart = urlParts[urlParts.length - 1];
    return lastPart.split(".")[0];
  } catch (error) {
    console.error("Erro ao extrair public_id da URL:", error);
    return null;
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
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
      where: { id: id },
    });

    if (!existingRegistro) {
      return NextResponse.json(
        {
          error: "Registro não localizado",
          message: "O registro que você está tentando excluir não existe",
        },
        {
          status: 404,
        },
      );
    }

    const imageUrl = existingRegistro.imageURL;

    await db.cutOut.delete({
      where: { id: id },
    });

    if (imageUrl) {
      try {
        const publicId = extractPublicIdFromUrl(imageUrl);

        if (publicId) {
          const cloudinaryResult = await cloudinary.uploader.destroy(publicId);

          console.log("Resultado da deleção no Cloudinary:", cloudinaryResult);

          return NextResponse.json(
            {
              message: "Registro e imagem excluídos com sucesso.",
              deletedRegistro: existingRegistro,
              cloudinaryResult,
            },
            { status: 200 },
          );
        }
      } catch (cloudinaryError) {
        console.error("Erro ao deletar imagem do Cloudinary:", cloudinaryError);
        return NextResponse.json(
          {
            message:
              "Registro excluído com sucesso, mas houve um erro ao excluir a imagem do Cloudinary.",
            deletedRegistro: existingRegistro,
          },
          { status: 200 },
        );
      }
    }

    return NextResponse.json(
      {
        message: "Registro excluído com sucesso.",
        deletedRegistro: existingRegistro,
      },
      { status: 200 },
    );
  } catch (err) {
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
