'use client';
import { Camera, Trash2 } from 'lucide-react';
import { InputCard } from './InputCard';
import CameraComponent from './CameraComponent';
import { useEffect, useState } from 'react';

type itemProps = {
  brand: string;
  vol: string;
  price: string;
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
  const handleInputChange = (field: keyof itemProps, newValue: string) => {
    setCards((prevCards) =>
      prevCards.map((card, idx) =>
        idx === identificator ? { ...card, [field]: newValue } : card
      )
    );
  };
  const formatPriceBRL = (newValue: string) => {
    let inputValue = newValue.replace(/\D/g, "");
    console.log(inputValue);
    inputValue = (parseInt(inputValue) / 100).toFixed(2);
    inputValue = inputValue.replace(".", ","); 
    inputValue = "R$ " + inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."); 
    handleInputChange("price", inputValue);
};

  function getImage(image: string) {
    console.log(image, 'aquii');
    setOpenCamera(false);
    processImage(image);
  }

  function closeCamera(){
    setOpenCamera(false)
  }

  const processImage = async (imageUrl: string) => {
    console.log('chegou na função');
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
        handleInputChange('brand', brand);
      }
      if (volume) {
        handleInputChange('vol', volume);
      }
      if (price) {
        formatPriceBRL(price);
      }

      console.log(brand);
      console.log(volume);
      console.log(price);
    } catch (error) {
      console.error('Error generating haiku:', error);
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className="p-3 pt-2 bg-gray500 rounded-xl">
        <div className="flex justify-between mb-2">
          <h1 className="text-orange300 font-bold">{`Cerveja ${
            identificator + 1
          }`}</h1>
          <div className="flex items-center gap-2 ">
            <Camera
              className="text-white"
              size={22}
              onClick={() => setOpenCamera(true)}
            />
            <Trash2
              className="text-redTrash"
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
        <div className="flex gap-2 mt-2">
          <InputCard
            placeholder="Volume (ml)"
            value={value.vol}
            onChange={(e) => handleInputChange('vol', e.target.value)}
          />
          <InputCard
            placeholder="Preço"
            value={value.price}
            onChange={(e) => formatPriceBRL(e.target.value)}
          />

        </div>
      </div>
      {openCamera &&<div className='flex items-center justify-center h-screen'>

       <CameraComponent getImage={getImage} close={closeCamera} />
      </div>}
    </>
  );
}
