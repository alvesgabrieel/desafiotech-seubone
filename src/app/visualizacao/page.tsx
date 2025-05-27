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

export default function Visualizacao() {
  const [isLoadingPecas, setIsLoadingPecas] = useState(true);
  const [pecas, setPecas] = useState<CutOut[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPecas, setSelectedPecas] = useState<CutOut[]>([]);

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
      toast.error("Ocorreu um erro ao carregar os registros");
      setPecas([]);
    } finally {
      setIsLoadingPecas(false);
    }
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

  return (
    <ProtectedRouter>
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
          <div className="my-7 flex justify-between px-7">
            <div className="flex items-center gap-3"></div>
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
              onSelectionChange={setSelectedIds}
              isVisualizacao={true}
            />
          )}
          <div className="flex justify-center">
            <Button
              className="mt-5"
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
