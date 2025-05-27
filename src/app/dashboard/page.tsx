"use client";

import type { CutOut } from "@prisma/client";
import { Loader, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toogle";
import ProtectedRoute from "@/components/protected-route";
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

export default function Page() {
  const { isLoading: isAuthLoading } = useAuthStore();

  const [pecas, setPecas] = useState<CutOut[]>([]);
  const [isLoadingPecas, setIsLoadingPecas] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPeca, setSelectedPeca] = useState<CutOut | null>(null);

  useEffect(() => {
    loadPecas();
  }, []);

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
    //Atualizar a lista de forma automatica ao salvar uma peça, sem precisar da reload na pagina
  };

  const handleViewMore = (peca: CutOut) => {
    setSelectedPeca(peca);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedPeca(null);
    setIsEditDialogOpen(false);
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
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <ModeToggle />
            </div>
          </header>
          <div className="flex justify-between px-7">
            <p className="text-2xl">Peças gerais</p>
            {/* Passar loadPecas para o dialog de registro atualizar a lista */}
            <RegistrarPecaDialog onRegisterSuccess={loadPecas} />
          </div>
          <div className="my-7 flex justify-between px-7">
            {/* TODO: Implementar filtros e busca */}
            <div className="flex items-center gap-3">
              {/* Exemplo: <div>Todos ({pecas.length})</div> */}
            </div>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1.5 left-2 h-5 w-5" />
              <Input
                placeholder="Buscar por título ou SKU..."
                className="pl-10"
              />
            </div>
          </div>

          {isLoadingPecas ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table
              pecas={pecas}
              handleView={handleViewMore}
              handleDelete={handleDelete}
              deletingId={deletingId}
            />
          )}

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
