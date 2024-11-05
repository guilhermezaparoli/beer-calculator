'use client';
import { BeerAddCard } from '@/components/BeerAddCard';
import { BeerCard } from '@/components/BeerCard';
import Image from 'next/image';
import logo from '../assets/BeerPriceLogo.svg';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { ModalResult } from '@/components/ModalResult';


type CardsProps = {
  brand: string;
  vol: string;
  price:string;
  volPerPrice: string;
  index?: number
}
export default function Home() {
  const [cards, setCards] = useState<CardsProps[]>([
    {
      brand: '',
      vol: '',
      price: '',
      volPerPrice: ""
    },
    {
      brand: '',
      vol: '',
      price: '',
      volPerPrice: ""
    },
  ]);
  const [result, setResult] = useState<CardsProps | null>(null)

  function onAddCard() {
    setCards((prev) => [
      ...prev,
      {
        brand: '',
        vol: '',
        price: '',
        volPerPrice: ""
      },
    ]);
  }

  function onDeleteAllCards() {
    setCards([
      {
        brand: '',
        vol: '',
        price: '',
        volPerPrice: ""

      },
      {
        brand: '',
        vol: '',
        price: '',
        volPerPrice: ""
      },
    ]);
  }

  function onDeleteCard(index: number) {
    const filteredCards = cards.filter((_, i) => i !== index);

    setCards(filteredCards);
  }

  function handleClose(){
    setResult(null)
  }

  function calculateTotal() {
    function parseVolume(vol: string): number {
      const value = parseFloat(vol.replace(/[^\d.]/g, ''));
      return vol.includes('L') ? value * 1000 : value;
    }

    const itemsWithVolPerPrice = cards.map((item) => {
      const priceNumber = parseFloat(
        item.price.replace('R$ ', '').replace(',', '.')
      );
      const volumeNumber = parseVolume(item.vol);
      const volPerPrice = priceNumber ? volumeNumber / priceNumber : 0;

      return {
        ...item,
        volPerPrice: volPerPrice.toFixed(2),
      };
    });

    const itemWithLowestVolPerPrice = itemsWithVolPerPrice.reduce((minItem, currentItem) => 
      currentItem.volPerPrice < minItem.volPerPrice ? currentItem : minItem
  );

  const indexOfLowestVolPerPrice = itemsWithVolPerPrice.reduce((minIndex, currentItem, currentIndex, array) => 
    currentItem.volPerPrice < array[minIndex].volPerPrice ? currentIndex : minIndex
, 0);

    setResult({...itemWithLowestVolPerPrice, index: indexOfLowestVolPerPrice + 1})
    setCards(itemsWithVolPerPrice);

  }
console.log(cards);
  console.log(result, 'result');
  return (
    <>
    <div className="pt-4 px-6 overflow-auto">
      <div className="flex items-center  justify-center pb-20">
        <Image src={logo} alt="logo" />
      </div>
      <div className="flex flex-col gap-4 mb-10">
        {cards.map((item, index) => (
          <BeerCard
          key={index}
          value={item}
          setCards={setCards}
          identificator={index}
          onDeleteCard={onDeleteCard}
          />
        ))}
      </div>
      <BeerAddCard onAddCard={onAddCard} />
      <footer className="mt-20 pb-4">
        <div className="flex items-center justify-center gap-5">
          <Button text="Limpar" color="bg-red-600" onClick={onDeleteAllCards} />
          <Button
            text="Calcular"
            color="bg-green-500"
            onClick={calculateTotal}
            />
        </div>
      </footer>
    
    </div>
  
   <ModalResult item={result} close={handleClose}/>
            </>
  );
}
