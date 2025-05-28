"use client";

import { CutOut } from "@prisma/client";
import { useEffect, useState } from "react";

import { columns } from "./colunas";
import { DataTable } from "./dados-tabela";

interface TableProps {
  pecas: CutOut[];
  handleView?: (peca: CutOut) => void;
  handleDelete?: (id: string) => Promise<void>;
  deletingId?: string | null;
  onSelectionChange?: (selectedIds: string[]) => void;
  isVisualizacao?: boolean;
}

export default function Table({
  pecas,
  handleView,
  handleDelete,
  deletingId,
  onSelectionChange,
  isVisualizacao = false,
}: TableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    if (isVisualizacao && onSelectionChange) {
      const selectedIds = Object.keys(rowSelection).map(
        (index) => pecas[Number(index)].id,
      );
      onSelectionChange(selectedIds);
    }
  }, [rowSelection, pecas, onSelectionChange, isVisualizacao]);

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6">
      <DataTable
        columns={columns({
          showActions: !isVisualizacao,
          handleView,
        })}
        data={pecas}
        rowSelection={isVisualizacao ? rowSelection : {}}
        onRowSelectionChange={isVisualizacao ? setRowSelection : undefined}
        meta={{
          handleDelete,
          deletingId,
        }}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
