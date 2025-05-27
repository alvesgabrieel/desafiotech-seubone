"use client";

import { CutOut } from "@prisma/client";
import Image from "next/image";

// import { Download } from "lucide-react";
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
  // Ordena as peças pela ordem de exibição (1 = fundo, maior = frente)
  const pecasOrdenadas = [...pecasSelecionadas].sort(
    (a, b) => a.ordemDeExibição - b.ordemDeExibição,
  );

  // const handleDownload = () => {
  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   // Configura o canvas com o tamanho da primeira imagem (todas devem ter mesma proporção)
  //   const img = new Image();
  //   img.src = pecasOrdenadas[0].imageURL;
  //   img.onload = () => {
  //     canvas.width = img.width;
  //     canvas.height = img.height;

  //     // Desenha cada imagem na ordem correta
  //     pecasOrdenadas.forEach((peca) => {
  //       const layerImg = new Image();
  //       layerImg.crossOrigin = "Anonymous";
  //       layerImg.src = peca.imageURL;
  //       ctx.drawImage(layerImg, 0, 0, canvas.width, canvas.height);
  //     });

  //     // Cria o link de download
  //     canvas.toBlob((blob) => {
  //       if (!blob) return;
  //       const url = URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = `modelo-${Date.now()}.png`;
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //       URL.revokeObjectURL(url);
  //     }, "image/png");
  //   };
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Pré-visualização do Modelo</DialogTitle>
        </DialogHeader>

        <div className="relative flex h-96 w-full items-center justify-center rounded-md bg-gray-100">
          <div className="relative h-full w-full">
            {pecasOrdenadas.map((peca) => (
              <Image
                width={330}
                height={160}
                key={peca.id}
                src={peca.imageURL}
                alt={peca.key}
                className="absolute top-0 left-0 h-full w-full object-contain"
                style={{ zIndex: peca.ordemDeExibição }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {/* <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Baixar Imagem
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MontarImagemDialog;
