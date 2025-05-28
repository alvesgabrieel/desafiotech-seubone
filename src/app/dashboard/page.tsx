"use client";

import type { CutOut } from "@prisma/client";
import { Loader, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toogle";
import ProtectedRoute from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";

import Table from "../tabela/tabela";
import { EditarPecaDialog } from "./components/editar-peca-dialog";
import { RegistrarPecaDialog } from "./components/registrar-peca-dialog";

type StatusFilter = "TODOS" | "ATIVO" | "INATIVO";

export default function Page() {
  const { isLoading: isAuthLoading } = useAuthStore();

  const [pecas, setPecas] = useState<CutOut[]>([]);
  const [filteredPecas, setFilteredPecas] = useState<CutOut[]>([]);
  const [isLoadingPecas, setIsLoadingPecas] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPeca, setSelectedPeca] = useState<CutOut | null>(null);

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
      toast.error("Erro ao carregar peças");
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
      filtered = filtered.filter(
        (peca) =>
          peca.key?.toLowerCase().includes(query) ||
          peca.sku?.toLowerCase().includes(query) ||
          peca.tipoProduto?.toLowerCase().includes(query) ||
          String(peca.ordemDeExibição).includes(query) ||
          peca.status?.toLowerCase().includes(query),
      );
    }

    setFilteredPecas(filtered);
  };

  const handleDelete = async (id: string) => {
    if (deletingId) return; // Impede exclusões simultâneas

    //>> Implementar dialog de confirmação

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta peça? Esta ação não pode ser desfeita.",
    );
    if (!confirmDelete) {
      return;
    }
    setDeletingId(id);
    try {
      const response = await fetch(`/api/cortes/delete?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
      }

      setPecas((prevPecas) => prevPecas.filter((p) => p.id !== id));
      toast.success(data.message);
    } catch (error) {
      console.error("Erro ao deletar peça:", error);
      toast.error("Erro ao excluir o registro");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSavePeca = (atualizarPeca: CutOut) => {
    setPecas((prevPecas) =>
      prevPecas.map((peca) =>
        peca.id === atualizarPeca.id ? atualizarPeca : peca,
      ),
    );
  };

  const handleViewMore = (peca: CutOut) => {
    setSelectedPeca(peca);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedPeca(null);
    setIsEditDialogOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (status: StatusFilter) => {
    setStatusFilter(status);
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
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
            <h1 className="text-xl sm:text-2xl">Peças gerais</h1>
            <RegistrarPecaDialog onRegisterSuccess={loadPecas} />
          </div>

          <div className="my-4 flex flex-col gap-4 px-4 sm:my-7 sm:flex-row sm:justify-between sm:px-6">
            <div className="flex justify-center gap-7">
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

          <div className="px-2 py-4 sm:px-6">
            {isLoadingPecas ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table
                pecas={filteredPecas}
                handleView={handleViewMore}
                handleDelete={handleDelete}
                deletingId={deletingId}
              />
            )}
          </div>

          {selectedPeca && (
            <EditarPecaDialog
              peca={selectedPeca}
              isOpen={isEditDialogOpen}
              onClose={handleCloseDialog}
              onSave={handleSavePeca}
            />
          )}
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
