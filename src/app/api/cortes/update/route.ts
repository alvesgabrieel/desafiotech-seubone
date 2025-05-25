import type { CutOut } from '@prisma/client';
import { Prisma } from '@prisma/client'; 
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'; 
import { NextResponse } from 'next/server';

import { db } from '@/lib/prisma';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true
});

interface CloudinaryErrorDirect {
    message: string;
    http_code: number;
}

function isCloudinaryErrorDirect(error: unknown): error is CloudinaryErrorDirect {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error && 
    'http_code' in error
  );
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID do recorte é obrigatório" }, { status: 400 });
    }

    const body = (await request.json()) as Partial<CutOut>;
    const registroAtual = await db.cutOut.findUnique({ where: { id } });

    if (!registroAtual) {
      return NextResponse.json({ error: "Registro de recorte não encontrado" }, { status: 404 });
    }

    const camposKey = ['tipoProduto', 'tipoRecorte', 'materialRecorte', 'corMaterial'] as const;
    const valoresAtuais = {
      tipoProduto: registroAtual.tipoProduto,
      tipoRecorte: registroAtual.tipoRecorte,
      materialRecorte: registroAtual.materialRecorte,
      corMaterial: registroAtual.corMaterial
    };

    const camposAlterados = camposKey.filter(
      campo => body[campo] !== undefined && body[campo] !== valoresAtuais[campo]
    );

    let novaKey = registroAtual.key;
    let novaImageURL = registroAtual.imageURL;
    let cloudinaryAtualizado = false;

    if (camposAlterados.length > 0) {
      const modelo = body.tipoProduto ?? registroAtual.tipoProduto;
      const tipoRecorte = body.tipoRecorte ?? registroAtual.tipoRecorte;
      const material = body.materialRecorte ?? registroAtual.materialRecorte;
      const cor = body.corMaterial ?? registroAtual.corMaterial;

      novaKey = `${modelo.toString().replace(/\s+/g, '_')}-${tipoRecorte.toString().replace(/\s+/g, '_')}-${material.toString().replace(/\s+/g, '_')}-${cor.toString().replace(/\s+/g, '_')}`.toLowerCase();

      if (novaKey !== registroAtual.key) {
        try {
          const result: UploadApiResponse = await cloudinary.uploader.rename(
            registroAtual.key,
            novaKey,
            { resource_type: 'image', overwrite: false }
          );
          novaImageURL = result.secure_url;
          cloudinaryAtualizado = true;
        } catch (error: unknown) {
          let errorMessage = 'Erro ao atualizar a imagem';
          let statusCode = 500;

          if (isCloudinaryErrorDirect(error)) {
            if (error.http_code === 404) {
              errorMessage = 'Imagem original não encontrada';
            } else if (error.http_code === 409) {
              errorMessage = 'Já existe uma imagem com os novos atributos';
              statusCode = 409;
            }
          }

          return NextResponse.json({ error: errorMessage }, { status: statusCode });
        }
      }
    }

    try {
      const updatedData = await db.cutOut.update({
        where: { id },
        data: {
          ...body,
          key: novaKey,
          imageURL: novaImageURL,
          updateAt: new Date()
        }
      });
      return NextResponse.json(updatedData);

    } catch (error: unknown) {
      if (cloudinaryAtualizado) {
        try {
          await cloudinary.uploader.rename(novaKey, registroAtual.key, { 
            resource_type: 'image', 
            overwrite: true 
          });
        } catch (rollbackError) {
          return NextResponse.json(
            { error: 'Erro ao atualizar registro. Estado inconsistente detectado.', rollbackError },
            { status: 500 }
          );
        }
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Já existe um registro com estes valores' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Erro ao atualizar o registro' },
        { status: 500 }
      );
    }

  } catch (err) {
    return NextResponse.json(
      { error: 'Erro ao processar a requisição', err },
      { status: 500 }
    );
  }
}