import { Cores, Modelo, Posicao, Tecido, TipoRecorte } from "@prisma/client";
import { Loader2, UploadIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEnumValue } from "@/utils/formatEnumValue";

interface RegistrarPecaDialogProps {
  onRegisterSuccess?: () => void;
}

export function RegistrarPecaDialog({
  onRegisterSuccess,
}: RegistrarPecaDialogProps) {
  const [sku, setSku] = useState("");
  const [tipoRecorte, setTipoRecorte] = useState<TipoRecorte | "">("");
  const [posicaoRecorte, setPosicaoRecorte] = useState<Posicao | "">("");
  const [ordemDeExibicao, setOrdemDeExibicao] = useState("");
  const [materialRecorte, setMaterialRecorte] = useState<Tecido | "">("");
  const [corMaterial, setCorMaterial] = useState<Cores | "">("");
  const [modeloProduto, setModeloProduto] = useState<Modelo | "">("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isDialogOpen) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetForm = () => {
    setSku("");
    setTipoRecorte("");
    setPosicaoRecorte("");
    setOrdemDeExibicao("");
    setMaterialRecorte("");
    setCorMaterial("");
    setModeloProduto("");
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsProcessing(false);
    setStatusMessage("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setStatusMessage("");
    setSelectedFile(null);

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        const errorMsg = "Erro: Arquivo muito grande (Max. 5MB).";
        setStatusMessage(errorMsg);
        toast.error(errorMsg);
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast.warning("Por favor, selecione uma imagem.");
      return;
    }
    if (
      !tipoRecorte ||
      !posicaoRecorte ||
      !modeloProduto ||
      !materialRecorte ||
      !corMaterial ||
      !ordemDeExibicao ||
      !sku
    ) {
      toast.warning("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Enviando imagem...");

    // --- 1. Upload da imagem do Cloudinary ---
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("modelo", modeloProduto);
    formData.append("tipoRecorte", tipoRecorte);
    formData.append("tecido", materialRecorte);
    formData.append("corTecido", corMaterial);

    let uploadData: { secure_url: string; public_id: string; message?: string };
    try {
      const response = await fetch("/api/cortes/create/upload", {
        method: "POST",
        body: formData,
      });
      uploadData = await response.json();
      if (!response.ok) {
        throw new Error(uploadData.message);
      }
      setStatusMessage("Upload concluído! Salvando dados...");
    } catch (uploadError) {
      setStatusMessage("Ocorreu um erro no upload da imagem");
      console.error(uploadError);
      toast.error("Ocorreu eu erro!");
      setIsProcessing(false);
      return;
    }

    // --- 2. Registrar peça no banco de dados ---
    const recorteData = {
      tipoRecorte: tipoRecorte,
      posicaoRecorte: posicaoRecorte,
      ordemDeExibicao: parseInt(ordemDeExibicao) || 0,
      materialRecorte: materialRecorte,
      corMaterial: corMaterial,
      sku: sku,
      tipoProduto: modeloProduto,
      imageURL: uploadData.secure_url,
      key: uploadData.public_id,
    };

    setStatusMessage("Salvando dados no banco...");
    try {
      const response = await fetch("/api/cortes/create/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recorteData),
      });

      const saveData = await response.json();
      if (!response.ok) {
        throw new Error(saveData.message);
      }

      toast.success("Peça cadastrada com sucesso!");
      setStatusMessage("");

      // --- 3. Chama função de callback passado via props ---
      onRegisterSuccess?.();
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      setStatusMessage("Erro ao salvar registro");
      toast.error("Ocorreu um erro");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-[#440986] text-white dark:text-white dark:hover:bg-[#c28efdcb]">
          Cadastrar peça
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90vh] overflow-auto p-4 sm:p-6"
        style={{ width: "95vw", maxWidth: "none" }}
      >
        <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Peça</DialogTitle>
            <DialogDescription>
              Preencha os dados da peça e faça o upload da imagem do recorte.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Especificações */}
            <div className="bg-muted rounded p-4">
              <p className="font-medium">Especificações</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="tipo-produto" className="mb-2">
                    Modelo do produto *
                  </Label>
                  <Select
                    value={modeloProduto}
                    onValueChange={(v) => setModeloProduto(v as Modelo)}
                    required
                    disabled={isProcessing}
                  >
                    <SelectTrigger
                      id="tipo-produto"
                      className="w-full bg-amber-50"
                    >
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Modelo).map((values) => (
                        <SelectItem key={values} value={values}>
                          {formatEnumValue(values)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tipo-recorte" className="mb-2">
                    Tipo do recorte *
                  </Label>
                  <Select
                    value={tipoRecorte}
                    onValueChange={(v) => setTipoRecorte(v as TipoRecorte)}
                    required
                    disabled={isProcessing}
                  >
                    <SelectTrigger
                      id="tipo-recorte"
                      className="w-full bg-amber-50"
                    >
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TipoRecorte).map((value) => (
                        <SelectItem key={value} value={value}>
                          {formatEnumValue(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="posicao-recorte" className="mb-2">
                    Posição do recorte *
                  </Label>
                  <Select
                    value={posicaoRecorte}
                    onValueChange={(v) => setPosicaoRecorte(v as Posicao)}
                    required
                    disabled={isProcessing}
                  >
                    <SelectTrigger
                      id="posicao-recorte"
                      className="w-full bg-amber-50"
                    >
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Posicao).map((values) => (
                        <SelectItem key={values} value={values}>
                          {formatEnumValue(values)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ordem-exibicao" className="mb-2">
                    Ordem de exibição *
                  </Label>
                  <Input
                    id="ordem-exibicao"
                    type="number"
                    value={ordemDeExibicao}
                    onChange={(e) => setOrdemDeExibicao(e.target.value)}
                    required
                    className="w-full bg-amber-50"
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <Label htmlFor="tecido" className="mb-2">
                    Tecido *
                  </Label>
                  <Select
                    value={materialRecorte}
                    onValueChange={(v) => setMaterialRecorte(v as Tecido)}
                    required
                    disabled={isProcessing}
                  >
                    <SelectTrigger id="tecido" className="w-full bg-amber-50">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Tecido).map((values) => (
                        <SelectItem key={values} value={values}>
                          {formatEnumValue(values)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cor-material" className="mb-2">
                    Cor do material *
                  </Label>
                  <Select
                    value={corMaterial}
                    onValueChange={(v) => setCorMaterial(v as Cores)}
                    required
                    disabled={isProcessing}
                  >
                    <SelectTrigger
                      id="cor-material"
                      className="w-full bg-amber-50"
                    >
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Cores).map((values) => (
                        <SelectItem key={values} value={values}>
                          {formatEnumValue(values)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Dados do produto */}
            <div className="bg-muted rounded p-4">
              <p className="font-medium">Dados do produto</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="sku" className="mb-2">
                    SKU *
                  </Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                    className="bg-amber-50"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>

            {/* upload da imagem */}
            <div className="bg-muted rounded p-4">
              <h3 className="font-medium">Mídia *</h3>
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-evenly">
                <div className="w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center sm:w-auto sm:p-6">
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                    required
                  />
                  <label
                    htmlFor="file-upload"
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 ${isProcessing ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <UploadIcon className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {previewUrl ? (
                        "Imagem selecionada:"
                      ) : (
                        <>
                          <span className="text-primary font-medium">
                            Clique para enviar
                          </span>{" "}
                          ou arraste uma imagem
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      Formatos: JPG, PNG (Max. 5MB)
                    </p>
                  </label>
                </div>
                {/* Preview area */}
                {previewUrl && (
                  <div className="text-center">
                    <Image
                      width={330}
                      height={160}
                      src={previewUrl}
                      alt="Pré-visualização"
                      className="mb-2 inline-block max-h-40 max-w-full rounded object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 pt-3 sm:flex-row">
            {/* Display da mensagem do status */}
            {statusMessage && (
              <p className="text-muted-foreground mr-auto text-sm">
                {statusMessage}
              </p>
            )}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isProcessing}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isProcessing || !selectedFile}
                className="w-full sm:w-auto"
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isProcessing ? "Salvando..." : "Cadastrar Peça"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
