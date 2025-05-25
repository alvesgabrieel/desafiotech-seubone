import {
  Cores,
  Modelo,
  Posicao,
  Status,
  Tecido,
  TipoRecorte} from '@prisma/client'; 
import { NextResponse } from 'next/server';

import { db } from '@/lib/prisma';

interface RegisterRequestBody {
  sku: string;
  key: string; 
  tipoRecorte: TipoRecorte;
  posicaoRecorte: Posicao;
  tipoProduto: Modelo;
  materialRecorte: Tecido;
  corMaterial: Cores;
  imageURL: string;
  ordemDeExibicao: string | number;
}

export async function POST(request: Request) {
    try {
      const requestBody: RegisterRequestBody = await request.json();

      if (
        !requestBody.sku ||
        !requestBody.key ||
        !requestBody.tipoRecorte ||
        !requestBody.posicaoRecorte ||
        !requestBody.tipoProduto ||
        !requestBody.materialRecorte ||
        !requestBody.corMaterial ||
        !requestBody.imageURL ||
        requestBody.ordemDeExibicao === undefined ||
        requestBody.ordemDeExibicao === null ||
        requestBody.ordemDeExibicao === ''
      ) {
        return NextResponse.json(
          { message: 'Dados incompletos para criar o recorte.' },
          { status: 400 },
        );
      }

    const ordemDeExibicao = parseInt(String(requestBody.ordemDeExibicao), 10);
    if (isNaN(ordemDeExibicao)) {
        return NextResponse.json(
          { message: 'Ordem de exibição inválida.' },
          { status: 400 },
        );
    }

    const recorteParaSalvar = {
      sku: requestBody.sku,
      key: requestBody.key,
      ordemDeExibição: ordemDeExibicao,
      tipoRecorte: requestBody.tipoRecorte,
      posicaoRecorte: requestBody.posicaoRecorte,
      tipoProduto: requestBody.tipoProduto,
      materialRecorte: requestBody.materialRecorte,
      corMaterial: requestBody.corMaterial,
      status: Status.ATIVO,
      imageURL: requestBody.imageURL,
    };

    const novoRecorte = await db.cutOut.create({
      data: recorteParaSalvar,
    });

    return NextResponse.json(novoRecorte, { status: 201 });

  } catch (err) {
    

    return NextResponse.json(
      { message: 'Erro interno ao salvar o recorte.', err },
      { status: 500 },
    );
  }
}
