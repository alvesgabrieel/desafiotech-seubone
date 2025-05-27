"use client";

import type { CutOut } from "@prisma/client";
import {
  Cores,
  Modelo,
  Posicao,
  Status,
  Tecido,
  TipoRecorte,
} from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditarPecaDialogProps {
  peca: CutOut;
  isOpen: boolean;
  onClose: () => void;
  onSave: (atualizarPeca: CutOut) => void;
}

const cores = Object.values(Cores);
const modelo = Object.values(Modelo);
const posicao = Object.values(Posicao);
const tecido = Object.values(Tecido);
const recorte = Object.values(TipoRecorte);

export const EditarPecaDialog = ({
  peca,
  isOpen,
  onClose,
  onSave,
}: EditarPecaDialogProps) => {
  const [editPeca, setEditPeca] = useState<CutOut>({
    ...peca,
    status: peca.status as Status,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditPeca((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`api/cortes/update?id=${editPeca.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editPeca),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      onSave(responseData);
      onClose();
      toast.success("Registro atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao atualizar o registro");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="h-[80vh] overflow-auto rounded-lg p-6"
        style={{ width: "80vw", maxWidth: "none" }}
      >
        <DialogHeader>
          <DialogTitle>Editar Peça</DialogTitle>
        </DialogHeader>
        <div className="grid h-full grid-rows-2 gap-4">
          {/* dados do produto */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted grid gap-4 rounded p-4">
              <p className="font-medium">Especificações</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipoProduto" className="mb-2">
                    Modelo do produto
                  </Label>
                  <select
                    name="tipoProduto"
                    value={editPeca.tipoProduto}
                    onChange={handleChange}
                    className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-foreground col-span-3 flex h-10 w-full rounded-md border bg-amber-50 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#b1b1b10f] dark:text-white"
                  >
                    {modelo.map((modeloProduto) => (
                      <option key={modeloProduto} value={modeloProduto}>
                        {modeloProduto}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="tipo-recorte" className="mb-2">
                    Tipo do recorte
                  </Label>
                  <select
                    name="tipoRecorte"
                    value={editPeca.tipoRecorte}
                    onChange={handleChange}
                    className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-foreground col-span-3 flex h-10 w-full rounded-md border bg-amber-50 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#b1b1b10f] dark:text-white"
                  >
                    {recorte.map((tipoRecorte) => (
                      <option key={tipoRecorte} value={tipoRecorte}>
                        {tipoRecorte}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="posicaoRecorte" className="mb-2">
                    Posição do recorte
                  </Label>
                  <select
                    name="posicaoRecorte"
                    value={editPeca.posicaoRecorte}
                    onChange={handleChange}
                    className="border-input ring-offset-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring col-span-3 flex h-10 w-full rounded-md border bg-amber-50 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#b1b1b10f] dark:text-white"
                  >
                    {posicao.map((posicaoRecorte) => (
                      <option key={posicaoRecorte} value={posicaoRecorte}>
                        {posicaoRecorte}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="ordemExibicao" className="mb-2">
                    Ordem de exibição
                  </Label>
                  <Input
                    id="ordemExibicao"
                    name="ordemExibicao"
                    type="number"
                    value={editPeca.ordemDeExibição}
                    onChange={handleChange}
                    className="text-foreground w-full bg-amber-50 dark:bg-[#b1b1b10f] dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tecido" className="mb-2">
                    Tecido
                  </Label>
                  <select
                    name="tecido"
                    value={editPeca.materialRecorte}
                    onChange={handleChange}
                    className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-foreground col-span-3 flex h-10 w-full rounded-md border bg-amber-50 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#b1b1b10f] dark:text-white"
                  >
                    {tecido.map((materialRecorte) => (
                      <option key={materialRecorte} value={materialRecorte}>
                        {materialRecorte}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="corMaterial" className="mb-2">
                    Cor do material
                  </Label>
                  <select
                    name="corMaterial"
                    value={editPeca.corMaterial}
                    onChange={handleChange}
                    className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-foreground col-span-3 flex h-10 w-full rounded-md border bg-amber-50 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#b1b1b10f] dark:text-white"
                  >
                    {cores.map((corMaterial) => (
                      <option key={corMaterial} value={corMaterial}>
                        {corMaterial}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-muted grid gap-4 rounded p-4">
              <p className="font-medium">Dados do produto</p>

              <div className="flex items-center gap-2">
                <Label htmlFor="status">Status</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="status"
                        checked={editPeca.status === "ATIVO"}
                        onCheckedChange={(checked) =>
                          setEditPeca({
                            ...editPeca,
                            status: checked ? "ATIVO" : "INATIVO",
                          })
                        }
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {editPeca.status === "ATIVO"
                        ? "Produto ativo"
                        : "Produto inativo"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div>
                <Label htmlFor="sku" className="mb-2">
                  SKU
                </Label>
                <Input
                  id="sku"
                  name="sku"
                  value={editPeca.sku}
                  onChange={handleChange}
                  className="text-foreground bg-amber-50 dark:bg-[#b1b1b10f] dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="key" className="mb-2">
                  Link da Imagem
                </Label>
                <Input
                  id="key"
                  name="key"
                  value={editPeca.key}
                  readOnly
                  disabled
                  className="text-foreground bg-amber-50 dark:bg-[#b1b1b10f] dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted space-y-4 rounded p-4">
            <h3 className="font-medium">Mídia *</h3>
            <div className="mt-20 flex justify-evenly">
              <div className="mt-4 text-center">
                <Image
                  width={330}
                  height={160}
                  src={editPeca.imageURL}
                  alt="Pré-visualização"
                  className="mb-2 inline-block max-h-40 rounded"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="py-3">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
