// Seu componente DialogDemo.tsx atualizado
import {
  Cores,
  Modelo,
  Posicao,
  Tecido,
  TipoRecorte,
} from '@prisma/client';
import { UploadIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react"; 

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
import { formatEnumValue } from '@/utils/formatEnumValue';

export function RegistrarPecaDialog() {
  const [sku, setSku] = useState("");
  const [tipoRecorte, setTipoRecorte] = useState<TipoRecorte | "">("");
  const [posicaoRecorte, setPosicaoRecorte] = useState<Posicao | "">("");
  const [ordemDeExibicao, setOrdemDeExibicao] = useState("");
  const [materialRecorte, setMaterialRecorte] = useState<Tecido | "">("");
  const [corMaterial, setCorMaterial] = useState<Cores | "">("");
  const [modeloProduto, setModeloProduto] = useState<Modelo | "">("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false); 

  useEffect(() => {
    if (!isDialogOpen) {
      resetForm();
    }
  }, [isDialogOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]); 

  const resetForm = () => {
    setTipoRecorte("");
    setPosicaoRecorte("");
    setOrdemDeExibicao("");
    setMaterialRecorte("");
    setCorMaterial("");
    setSku("");
    setModeloProduto("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
    setUploadStatus("");
    setUploadedImageUrl(null);
  };  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Limpa a URL de preview anterior para liberar memória
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
         setUploadStatus('Erro: Arquivo muito grande (Max. 5MB).');
         setSelectedFile(null);
         return;
      }
      setSelectedFile(file);
      setUploadStatus('');
      setUploadedImageUrl(null); 

      // Gera a URL de objeto para a pré-visualização
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

    } else {
      setSelectedFile(null);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadStatus("Por favor, selecione uma imagem.");
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
      setUploadStatus("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Enviando imagem...");

    const formData = new FormData();
    formData.append("image", selectedFile);
    
    formData.append("modelo", modeloProduto); 
    formData.append("tipoRecorte", tipoRecorte);
    formData.append("tecido", materialRecorte);
    formData.append("corTecido", corMaterial);

    let uploadData: { secure_url: string; public_id: string };

    // --- 1. Upload para Cloudinary ---
    try {
      const response = await fetch("/api/cortes/create/upload", {
        method: "POST",
        body: formData,
      });
      uploadData = await response.json();
      if (!response.ok) {
        throw new Error("Falha no upload da imagem.");
      }
      setUploadStatus("Upload concluído! Salvando dados...");
      setUploadedImageUrl(uploadData.secure_url);
      console.log("URL Cloudinary:", uploadData.secure_url);
      console.log("Public ID:", uploadData.public_id);
    } catch (uploadError) {
      console.error("Erro no upload:", uploadError);
      setUploadStatus(`Erro no upload`);
      setIsUploading(false);
      return; 
    }

    // --- 2. Salvar Dados no Banco ---
    const recorteData = {
      tipoRecorte: tipoRecorte,
      posicaoRecorte: posicaoRecorte,
      ordemDeExibicao: ordemDeExibicao,
      materialRecorte: materialRecorte,
      corMaterial: corMaterial,
      sku: sku,
      tipoProduto: modeloProduto,
      imageURL: uploadData.secure_url, 
      key: uploadData.public_id
    };
    console.log("Dados do recorte para salvar:", recorteData);

    try {
      const saveResponse = await fetch("/api/cortes/create/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recorteData),
      });
      const saveData = await saveResponse.json();
      if (!saveResponse.ok) {
        throw new Error(
          saveData.message || "Falha ao salvar os dados do recorte.",
        );
      }
      setUploadStatus("Recorte cadastrado com sucesso!");
      console.log("Recorte salvo:", saveData);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar no banco:", err);
      setUploadStatus(`Erro ao salvar`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#440986] text-white dark:text-white">Cadastrar peça</Button>
      </DialogTrigger>
      <DialogContent
        className="h-[80vh] overflow-auto rounded-lg p-6"
        style={{ width: "80vw", maxWidth: "none" }}
      >
        <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Peça</DialogTitle>
            <DialogDescription>
              Preencha os dados da peça e faça o upload da imagem do recorte.
            </DialogDescription>
          </DialogHeader>
          <div className="grid h-full grid-rows-2 gap-4">
            {/* dados do produto */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted grid gap-4 rounded p-4">
                <p className="font-medium">Especificações</p>
                <div className="grid grid-cols-2 gap-4">
                 <div>
                  <Label htmlFor="tipo-produto" className="mb-2">Modelo do produto *</Label>
                  <Select
                    value={modeloProduto}
                    onValueChange={(v) => setModeloProduto(v as Modelo)}
                    required
                  >
                    <SelectTrigger id="tipo-produto" className="w-full bg-amber-50">
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
                    <Label htmlFor="tipo-recorte" className="mb-2">Tipo do recorte *</Label>
                    <Select
                      value={tipoRecorte}
                      onValueChange={(v) =>
                        setTipoRecorte(v as TipoRecorte)
                      }
                      required
                       
                    >
                      <SelectTrigger id="tipo-recorte" className="w-full bg-amber-50">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent >
                       {Object.values(TipoRecorte).map((value) => (
                        <SelectItem key={value} value={value}>
                          {formatEnumValue(value)}
                        </SelectItem>
                       ))}
                       </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="posicao-recorte" className="mb-2">
                      Posição do recorte *
                    </Label>
                    <Select
                      value={posicaoRecorte}
                      onValueChange={(v) => setPosicaoRecorte(v as Posicao)}
                      required
                    >
                      <SelectTrigger id="posicao-recorte" className="w-full bg-amber-50">
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
                    <Label htmlFor="ordem-exibicao" className="mb-2">Ordem de exibição *</Label>
                    <Input
                      id="ordem-exibicao"
                      type="number"
                      value={ordemDeExibicao}
                      onChange={(e) => setOrdemDeExibicao(e.target.value)}
                      required
                      className="w-full bg-amber-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tecido" className="mb-2">Tecido *</Label>
                    <Select
                      value={materialRecorte}
                      onValueChange={(v) => setMaterialRecorte(v as Tecido)}
                      required
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
                    <Label htmlFor="cor-material" className="mb-2">Cor do material *</Label>
                    <Select
                      value={corMaterial}
                      onValueChange={(v) => setCorMaterial(v as Cores)}
                      required
                    >
                      <SelectTrigger id="cor-material" className="w-full bg-amber-50">
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
              <div className="bg-muted grid gap-4 rounded p-4">
                <p className="font-medium">Dados do produto</p>
                <div>
                  <Label htmlFor="sku" className="mb-2">SKU *</Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                    className="bg-amber-50"
                  />
                </div>
                <div>
                  <Label htmlFor="key" className="mb-2">
                    Link da Imagem (gerado após upload)
                  </Label>
                  <Input
                    id="key"
                    value={uploadedImageUrl || ""}
                    readOnly
                    disabled
                    className="bg-amber-50"
                  />
                </div>
              </div>
            </div>

            {/* upload da imagem do produto */}
            <div className="bg-muted space-y-4 rounded p-4">
              <h3 className="font-medium">Mídia *</h3>
              <div className="flex justify-evenly mt-20">
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                    <Input
                    id="file-upload"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    required 
                    />
                    <label
                    htmlFor="file-upload"
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 ${isUploading ? "cursor-not-allowed opacity-50" : ""}`}
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

                {/* Pré-visualização e Status */}
                <div className="mt-4 text-center">
                    {previewUrl && (
                    <Image
                    width={330}
                    height={160}
                        src={previewUrl}
                        alt="Pré-visualização"
                        className="mb-2 inline-block max-h-40 rounded"
                    />
                    )}
                    {uploadStatus && (
                    <p className="text-sm text-gray-600">{uploadStatus}</p>
                    )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="py-3">
            {/* Adicionar um botão para fechar/cancelar */}
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isUploading || !selectedFile}>
              {isUploading ? "Salvando..." : "Cadastrar Peça"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
