'use client';
import { BeerAddCard } from '@/components/BeerAddCard';
import { BeerCard } from '@/components/BeerCard';
import Image from 'next/image';
import logo from '../assets/BeerPriceLogo.svg';
import { useState } from 'react';
import { Button } from '@/components/Button';

export default function Home() {
  const [cards, setCards] = useState([
    {
      brand: '',
      vol: '',
      price: '',
    },
    {
      brand: '',
      vol: '',
      price: '',
    },
  ]);

  function onAddCard() {
    setCards((prev) => [
      ...prev,
      {
        brand: '',
        vol: '',
        price: '',
      },
    ]);
  }

  function onDeleteAllCards() {
    setCards([
      {
        brand: '',
        vol: '',
        price: '',
      },
      {
        brand: '',
        vol: '',
        price: '',
      },
    ]);
  }

  function onDeleteCard(index: number) {
    const filteredCards = cards.filter((_, i) => i !== index);

    setCards(filteredCards);
  }


  function calculateTotal() {

  }

  
  console.log(cards);
  return (
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
          <Button text="Calcular" color="bg-green-500" onClick={calculateTotal} />
        </div>
      </footer>
    </div>
  );
}
