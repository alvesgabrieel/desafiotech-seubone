"use client"; // Adicione isso no topo

import { useEffect, useState } from "react";

import { columns } from "./colunas";
import { DataTable } from "./tabela";

export default function CortesTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/cortes/read");
      const result = await response.json();
      setData(result);
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-7">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
