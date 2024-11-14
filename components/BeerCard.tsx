'use client';
import { Camera, Trash2 } from 'lucide-react';
import { InputCard } from './InputCard';
import CameraComponent from './CameraComponent';
import { useState } from 'react';
import { InputSelectCard } from './InputSelectCard';
import { toast } from 'react-toastify';
import useImageCompressor from '@/hooks/useImageCompressor';

type itemProps = {
  brand: string;
  volume: string;
  price: string;
  volPerPrice?: number | null;
  index?: number;
};
type BeerCardProps = {
  value: itemProps;
  onDeleteCard: (value: number) => void;
  identificator: number;
  setCards: React.Dispatch<React.SetStateAction<itemProps[]>>;
};

export function BeerCard({
  value,
  setCards,
  identificator,
  onDeleteCard,
}: BeerCardProps) {
  const [openCamera, setOpenCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const {loadingCompress, compressImage} = useImageCompressor()
  const handleInputChange = (field: keyof itemProps, newValue: string) => {
    setCards((prevCards) =>
      prevCards.map((card, idx) =>
        idx === identificator ? { ...card, [field]: newValue } : card
      )
    );
  };

  const handleVolumeChange = (newValue: string) => {

    handleInputChange('volume', newValue);
  };

  const formatPriceBRL = (newValue: string) => {
    let inputValue = String(newValue)?.replace(/\D/g, '');
    inputValue = (parseInt(inputValue) / 100).toFixed(2);
    inputValue = inputValue.replace('.', ',');
    inputValue = 'R$ ' + inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    handleInputChange('price', inputValue);
  };

  function getImage(image: string | null) {
    setOpenCamera(false);
  
    // Verifica se a imagem é válida e a comprime
    const dataURLtoFile = (dataurl: string, filename: string): File => {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    };


    if (image) {
      const file = dataURLtoFile(image, "captured-image.png");
      compressImage(file).then((compressedBase64) => {
        if (compressedBase64) {
          processImage(compressedBase64); // Processa a imagem comprimida
        }
      });
    }
  }
  

  function closeCamera() {
    setOpenCamera(false);
  }

  const processImage = async (imageUrl: string | null) => {
    setLoading(true);

    if (!imageUrl) {
      setLoading(false);
      toast.error('Houve um erro ao processar a imagem');
    }
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });
      const result = await response.json();

      const formattedString = result.replace(/(\w+):/g, '"$1":');

      const { brand, volume, price } = JSON.parse(formattedString);

      if (brand) {
        handleInputChange('brand', String(brand));
      }
      if (volume) {
        handleInputChange('volume', String(volume) + 'ml');
      }
      if (price) {
        formatPriceBRL(String(price));
      }

    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Houve um erro ao processar a imagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-3 pt-2 bg-gray500 rounded-xl">
        <div className="flex justify-between mb-2">
          <h1 className="text-orange300 font-bold">{`Cerveja ${
            identificator + 1
          }`}</h1>
          <div className="flex items-center gap-2 ">
            <Camera
              className="text-white cursor-pointer"
              size={22}
              onClick={() => setOpenCamera(true)}
            />
            <Trash2
              className="text-redTrash cursor-pointer"
              size={20}
              onClick={() => onDeleteCard(identificator)}
            />
          </div>
        </div>
        <InputCard
          placeholder="Marca"
          value={value.brand}
          onChange={(e) => handleInputChange('brand', e.target.value)}
        />
        <div className="flex gap-2 mt-2 ">
          <div className="flex w-full">
            <InputSelectCard
              placeholder="Volume (ml)"
              value={value.volume}
              handleVolumeChange={handleVolumeChange}
              onChange={(e) => {
                const value = e.target.value.replace('ml', '');
                if (Number(value || value === '')) {
                  handleInputChange('volume', value.replace('ml', ''));
                }
              }}
              suggestions={[
                '269ml',
                '300ml',
                '355ml',
                '473ml',
                '500ml',
                '600ml',
                '1000ml',
              ]}
            />
          </div>

          <InputCard
            placeholder="Preço"
            value={value.price}
            onChange={(e) => formatPriceBRL(e.target.value)}
          />
        </div>
      </div>
      {openCamera && navigator.mediaDevices && (
        <div className="flex items-center justify-center h-screen">
          <CameraComponent getImage={getImage} close={closeCamera} />
        </div>
      )}

      {(loading || loadingCompress) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 flex-col">
          <svg
            aria-hidden="true"
            className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          {loading && 
          <label className="text-white">Processando imagem...</label>
        }
          {loadingCompress &&
        <label className="text-white">Comprimindo imagem...</label>
          
          }
        </div>
      )}
    </>
  );
}
