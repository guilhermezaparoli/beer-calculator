'use client'
import { Camera, Trash2 } from 'lucide-react';
import { InputCard } from './InputCard';
import { useEffect, useState } from 'react';

type itemProps = {
  brand: string,
  vol: string,
  price: string,
}
type BeerCardProps = {
  value: itemProps;
  onDeleteCard: (value: number) => void;
  identificator: number;
  setCards: React.Dispatch<React.SetStateAction<itemProps[]>>;
};


export function BeerCard({ value, setCards, identificator, onDeleteCard }: BeerCardProps) {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)

  const handleInputChange = (field: keyof itemProps, newValue: string) => {
    setCards(prevCards =>
      prevCards.map((card, idx) =>
        idx === identificator ? { ...card, [field]: newValue } : card
      )
    );
  };


  const handleCameraClick = async () => {
    if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    } else {
      alert("Camera access is not supported on this device or browser.");
    }
  };
  

  useEffect(() => {
    return () => {
      // Clean up the video stream when the component unmounts
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);
  return (
    <div className="p-3 pt-2 bg-gray500 rounded-xl">
      <div className="flex justify-between mb-2">
        <h1 className="text-orange300 font-bold">{`Cerveja ${identificator + 1}`}</h1> 
        <div className='flex items-center gap-2 '>
          <Camera className='text-white' size={22} onClick={handleCameraClick}/>
        <Trash2 className="text-redTrash" size={20} onClick={() => onDeleteCard(identificator)} />
        </div>
      </div>
      <InputCard
        placeholder="Marca"
        value={value.brand}
        onChange={(e) => handleInputChange('brand', e.target.value)}
      />
      <div className="flex gap-2 mt-2">
        <InputCard
          placeholder="Volume (ml)"
          value={value.vol}
          onChange={(e) => handleInputChange('vol', e.target.value)}
        />
        <InputCard
          placeholder="Preço"
          value={value.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
        />
      </div>
    </div>
  );
}
