import { UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Cadastrar peça</Button>
      </DialogTrigger>
      <DialogContent 
        className="h-[80vh] p-6 rounded-lg overflow-auto"
        style={{ width: '80vw', maxWidth: 'none' }}
       >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-rows-2 gap-4 h-full">
            {/* dados do produto */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded p-4 grid gap-4">
                    <p>Especificações</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nome-modelo">Nome do modelo</label>
                            <Input id="nome-modelo"/>
                        </div>
                        <div>
                            <label htmlFor="tipo-recorte">Tipo do recorte</label>
                            <div><Input id="tipo-recorte"/></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="posicao-imagem">Posição da imagem</label>
                            <Input id="posicao-imagem"/>
                        </div>
                        <div>
                            <label htmlFor="ordem-exibicao">Ordem de exibição</label>
                            <Input id="ordem-exibicao"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tecido">Tecido</label>
                            <Input id="tecido"/>
                        </div>
                        <div>
                            <label htmlFor="cor-tecido">Cor do tecido</label>
                            <Input id="cor-tecido"/>
                        </div>
                    </div>
                </div>
                <div className="bg-muted rounded p-4 grid gap-4">
                    <p >Dados do produto</p>
                    <div>
                        <label htmlFor="sku">SKU</label>
                        <Input id="sku"/>
                    </div>
                    <div>
                        <label htmlFor="key">Product key gerada</label>
                        <Input id="key"/>
                    </div>
                </div>
            </div>

            {/* ipload da imagem do produto */}
            <div className="bg-muted rounded p-4 space-y-4">
            <h3 className="font-medium">Mídia</h3>
            
                {/* Área de Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Input 
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                        console.log("Arquivo selecionado:", file);
                        
                        }
                    }}
                    />
                    
                    <label 
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                    <UploadIcon className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                        <span className="font-medium text-primary">Clique para enviar</span> ou arraste uma imagem
                    </p>
                    <p className="text-xs text-gray-400">Formatos: JPG, PNG (Max. 5MB)</p>
                    </label>
                </div>

                {/* Pré-visualização */}
                <div className="mt-4">
                    {/* Exibição da imagem selecionada */}
                    {/* {selectedImage && (
                    <img 
                        src={URL.createObjectURL(selectedImage)} 
                        alt="Pré-visualização" 
                        className="max-h-40 rounded"
                    />
                    )} */}
                </div>
                </div>
            </div>
        <DialogFooter>
          <Button type="submit">Cadastrar peça</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
