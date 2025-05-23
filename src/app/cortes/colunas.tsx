"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Cortes = {
  sku?: string;
  key?: string;
  ordemDeExibição?: number;
  tipoRecorte?: string;
  posicaoRecorte?: string;
  tipoProduto?: string;
  materialRecorte?: string;
  corMaterial?: string;
  status?: string;
  imageURL?: string;
};

export const columns: ColumnDef<Cortes>[] = [
  {
    accessorKey: "key",
    header: "Título",
  },
  {
    accessorKey: "sku",
    header: "Sku",
  },
  {
    accessorKey: "tipoProduto",
    header: "Tipo",
  },
  {
    accessorKey: "ordemDeExibição",
    header: "Ordem de exibição",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
