"use client";

import { CutOut } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MontarImagemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pecasSelecionadas: CutOut[];
}

const MontarImagemDialog = ({
  isOpen,
  onClose,
  pecasSelecionadas,
}: MontarImagemDialogProps) => {
  const pecasOrdenadas = [...pecasSelecionadas].sort(
    (a, b) => a.ordemDeExibição - b.ordemDeExibição,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[90vh] max-h-[90vh] w-[95vw] max-w-[95vw] flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Pré-visualização do Modelo
          </DialogTitle>
        </DialogHeader>

        <div className="relative min-h-0 w-full flex-1 overflow-auto rounded-md bg-gray-100">
          <div className="relative h-full w-full">
            {pecasOrdenadas.map((peca) => (
              <Image
                fill
                key={peca.id}
                src={peca.imageURL}
                alt={peca.key}
                className="object-contain"
                style={{ zIndex: peca.ordemDeExibição }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MontarImagemDialog;
