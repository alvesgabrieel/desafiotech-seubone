"use client";

import { Loader, Search } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toogle";
import ProtectedRoute from "@/components/protectedRoute";
import {} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";

import CortesTable from "../cortes/dados-tabela";
import { DialogDemo } from "./registrar-peca-dialog";

export default function Page() {
  const { isLoading } = useAuthStore();

  if (isLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );

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
          <div className="flex justify-between">
            <div className="px-7">
              <p className="text-2xl">Peças gerais</p>
            </div>
            <div className="px-7">
              <DialogDemo />
            </div>
          </div>
          <div className="my-7 flex justify-between">
            <div className="flex items-center gap-3 px-7">
              <div>Todos (7)</div>
              <div>Ativos (5)</div>
              <div>Expirados (2)</div>
            </div>
            <div className="px-7">
              <div className="relative">
                <Search className="absolute top-1.5 left-2" />
                <Input className="pl-10" />
              </div>
            </div>
          </div>

          <CortesTable />
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
