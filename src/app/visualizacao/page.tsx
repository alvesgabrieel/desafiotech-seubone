"use client";

import { CutOut } from "@prisma/client";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toogle";
import ProtectedRouter from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import Table from "../tabela/tabela";
import MontarImagemDialog from "./components/montar-imagem-dialog";

type StatusFilter = "TODOS" | "ATIVO" | "INATIVO";

export default function Visualizacao() {
  const [isLoadingPecas, setIsLoadingPecas] = useState(true);
  const [pecas, setPecas] = useState<CutOut[]>([]);
  const [filteredPecas, setFilteredPecas] = useState<CutOut[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPecas, setSelectedPecas] = useState<CutOut[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS");

  useEffect(() => {
    loadPecas();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pecas, searchQuery, statusFilter]);

  const loadPecas = async () => {
    setIsLoadingPecas(true);
    try {
      const response = await fetch("/api/cortes/read");
      if (!response.ok) throw new Error("Falha ao carregar peças");
      const data = await response.json();
      setPecas(data);
    } catch (error) {
      console.error("Erro ao carregar peças:", error);
      toast.error("Ocorreu um erro ao carregar os registros");
      setPecas([]);
    } finally {
      setIsLoadingPecas(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...pecas];

    if (statusFilter !== "TODOS") {
      filtered = filtered.filter((peca) => peca.status === statusFilter);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((peca) => {
        if (peca.key?.toLowerCase().includes(query)) return true;
        if (peca.sku?.toLowerCase().includes(query)) return true;
        if (peca.tipoProduto?.toLowerCase().includes(query)) return true;
        if (peca.status?.toLowerCase().includes(query)) return true;
        String(peca.ordemDeExibição).includes(query);
      });
    }

    setFilteredPecas(filtered);
  };

  const handleGenerateImage = () => {
    if (selectedIds.length === 0) {
      toast.warning("Selecione pelo menos uma peça");
      return;
    }

    const selecionadas = pecas.filter((p) => selectedIds.includes(p.id));
    setSelectedPecas(selecionadas);
    setIsDialogOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (status: StatusFilter) => {
    setStatusFilter(status);
  };

  return (
    <ProtectedRouter>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 items-center gap-2 px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <ModeToggle />
            </div>
          </header>
          <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <h1 className="text-xl sm:text-2xl">Visualização da imagem</h1>
          </div>
          <div className="my-4 flex flex-col gap-4 px-4 sm:my-7 sm:flex-row sm:justify-between sm:px-6">
            <div className="flex gap-7">
              <Button
                variant="ghost"
                onClick={() => handleStatusFilterChange("TODOS")}
                className={`px-4 py-2 ${statusFilter === "TODOS" ? "bg-[#440986] text-white hover:bg-[#440986]/90" : ""}`}
              >
                Todos
              </Button>

              <Button
                variant="ghost"
                onClick={() => handleStatusFilterChange("ATIVO")}
                className={`px-4 py-2 ${statusFilter === "ATIVO" ? "bg-[#440986] text-white hover:bg-[#440986]/90" : ""}`}
              >
                Ativos
              </Button>

              <Button
                variant="ghost"
                onClick={() => handleStatusFilterChange("INATIVO")}
                className={`px-4 py-2 ${statusFilter === "INATIVO" ? "bg-[#440986] text-white hover:bg-[#440986]/90" : ""}`}
              >
                Inativos
              </Button>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:h-5 sm:w-5" />
              <Input
                placeholder="Buscar por título, SKU, tipo, ordem ou status..."
                className="w-full pl-10 sm:w-64"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="px-2 sm:px-6">
            {isLoadingPecas ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table
                pecas={filteredPecas}
                onSelectionChange={setSelectedIds}
                isVisualizacao={true}
              />
            )}
          </div>

          <div className="flex justify-center px-4 py-4 sm:px-6">
            <Button
              className="w-full cursor-pointer bg-[#440986] text-white sm:w-auto dark:text-white dark:hover:bg-[#c28efdcb]"
              onClick={handleGenerateImage}
              disabled={selectedIds.length === 0}
            >
              Gerar imagem
            </Button>
          </div>

          <MontarImagemDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            pecasSelecionadas={selectedPecas}
          />
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRouter>
  );
}
