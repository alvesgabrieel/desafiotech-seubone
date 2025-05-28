import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from "cloudinary";
import { NextResponse } from "next/server";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const imageFile = formData.get("image") as File | null;
    const modelo = formData.get("modelo") as string | null;
    const tipoRecorte = formData.get("tipoRecorte") as string | null;
    const tecido = formData.get("tecido") as string | null;
    const corTecido = formData.get("corTecido") as string | null;

    if (!modelo || !tipoRecorte || !tecido || !corTecido) {
      return NextResponse.json(
        { message: "Dados do recorte incompletos para gerar a key" },
        { status: 400 },
      );
    }
    if (!imageFile) {
      return NextResponse.json(
        { message: "Nenhuma imagem enviada." },
        { status: 400 },
      );
    }

    const publicIdKey =
      `${modelo.replace(/\s+/g, "_")}-${tipoRecorte.replace(/\s+/g, "_")}-${tecido.replace(/\s+/g, "_")}-${corTecido.replace(/\s+/g, "_")}`.toLowerCase();

    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: publicIdKey,
            overwrite: true,
            resource_type: "image",
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            if (error) {
              console.error("Erro callback Cloudinary:", error);
              reject(error);
            } else if (result) {
              console.log("Sucesso callback Cloudinary.");
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            } else {
              console.error("Callback Cloudinary sem erro/resultado.");
              reject(new Error("Falha indeterminada no upload Cloudinary."));
            }
          },
        );
        uploadStream.end(fileBuffer);
      },
    );

    console.log("Upload Cloudinary concluído:", result);

    return NextResponse.json(
      { secure_url: result.secure_url, public_id: result.public_id },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Erro interno ao fazer upload da imagem", err },
      { status: 500 },
    );
  }
}
