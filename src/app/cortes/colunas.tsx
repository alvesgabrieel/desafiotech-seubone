"use client";

import { CutOut } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

export const columns: ColumnDef<CutOut>[] = [
  {
    accessorKey: "key",
    header: "Título",
  },
  {
    accessorKey: "sku", 
    header: "SKU",
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
    cell: ({ row }) => {
      const status = row.original.status; // Assume que CutOut tem um campo 'status' ("ATIVO" ou "EXPIRADO")
      return (
        <span 
          className={`px-2 py-1 rounded text-xs font-medium ${
            status === "ATIVO" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="icon"
        onClick={() => console.log(row.original)}
        className="cursor-pointer"
      >
        <Trash className="h-4 w-4" />
      </Button>
    ),
  },
];