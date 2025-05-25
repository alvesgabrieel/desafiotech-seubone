"use client";

import { CutOut } from "@prisma/client";

import { columns } from "./colunas";
import { DataTable } from "./tabela";

interface CortesTableProps {  
  peca: CutOut[];
  handleView: (peca: CutOut) => void;
}

export default function CortesTable({ peca, handleView }: CortesTableProps) {
  return (
    <div className="container mx-auto px-7">
      <DataTable columns={columns} data={peca} viewMore={handleView} />
    </div>
  );
}
