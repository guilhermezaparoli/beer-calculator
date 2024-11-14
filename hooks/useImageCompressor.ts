// hooks/useImageCompressor.ts
import { useState } from "react";
import imageCompression, { Options } from "browser-image-compression";

interface UseImageCompressorReturn {
  compressedImage: string | null;
  compressImage: (file: File, options?: Options) => Promise<string | null>;
  loadingCompress: boolean;
  error: string | null;
}

export default function useImageCompressor(): UseImageCompressorReturn {
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [loadingCompress, setLoadingCompress] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const compressImage = async (
    file: File,
    options: Options = {}
  ): Promise<string | null> => {
    setLoadingCompress(true); // Ativa o estado de carregamento ao iniciar a compressão
    setError(null);

    const defaultOptions: Options = {
      maxSizeMB: 1, // Tamanho máximo desejado em MB
      maxWidthOrHeight: 1024, // Largura/altura máxima para a imagem comprimida
      useWebWorker: true,
      ...options,
    };

    try {
      const compressedFile = await imageCompression(file, defaultOptions);

      // Converter o arquivo comprimido para base64
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setCompressedImage(base64data);
          setLoadingCompress(false); // Desativa o estado de carregamento após a compressão
          resolve(base64data);
        };
        reader.onerror = () => {
          setLoadingCompress(false);
          reject("Erro ao ler o arquivo comprimido.");
        };
      });
    } catch (err) {
      setError("Erro ao comprimir a imagem.");
      setLoadingCompress(false); // Desativa o estado de carregamento caso ocorra um erro
      console.error(err);
      return null;
    }
  };

  return { compressedImage, compressImage, loadingCompress, error };
}
