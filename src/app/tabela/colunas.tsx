"use client";

import { CutOut } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Eye, Loader2, Trash, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ColumnsOptions {
  showActions: boolean;
  handleView?: (peca: CutOut) => void;
}

export const columns = (options: ColumnsOptions): ColumnDef<CutOut>[] => {
  const baseColumns: ColumnDef<CutOut>[] = [
    {
      accessorKey: "key",
      header: "Título",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("key")}</span>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue("sku")}</span>
      ),
    },
    {
      accessorKey: "tipoProduto",
      header: "Tipo",
      cell: ({ row }) => {
        const tipo = row.getValue("tipoProduto");
        return <span className="capitalize">{String(tipo).toLowerCase()}</span>;
      },
    },
    {
      accessorKey: "ordemDeExibição",
      header: () => <div className="text-center">Ordem</div>,
      cell: ({ row }) => {
        const ordem = row.getValue("ordemDeExibição");
        return <div className="flex justify-center">{Number(ordem)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status");
        const isAtivo = status === "ATIVO";

        return (
          <div
            className={`flex justify-center ${isAtivo ? "text-green-600" : "text-red-600"}`}
          >
            {isAtivo ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
          </div>
        );
      },
    },
  ];

  if (!options.showActions) {
    baseColumns.unshift({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
          className="translate-y-[2px]"
        />
      ),
      size: 40,
    });
  }

  if (options.showActions) {
    baseColumns.push({
      id: "actions",
      cell: ({ row, table }) => {
        const peca = row.original;
        const meta = table.options.meta as {
          handleDelete: (id: string) => void;
          deletingId: string | null;
        };

        return (
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => options.handleView?.(peca)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={meta?.deletingId === peca.id}
              onClick={() => meta?.handleDelete(peca.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
            >
              {meta?.deletingId === peca.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
            </Button>
          </div>
        );
      },
      size: 80,
    });
  }

  return baseColumns;
};
