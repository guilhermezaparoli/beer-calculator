'use client';
import { BeerAddCard } from '@/components/BeerAddCard';
import { BeerCard } from '@/components/BeerCard';
import Image from 'next/image';
import logo from '../assets/Calculadora-de-cerveja-logo.svg';
import IconBeer from '../assets/beer-27 1.svg';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { ModalResult } from '@/components/ModalResult';
import { toast } from 'react-toastify';

type CardsProps = {
  brand: string;
  volume: string;
  price: string;
  volPerPrice?: number | null;
  index?: number;
};
export default function Home() {
  const [cards, setCards] = useState<CardsProps[]>([
    {
      brand: '',
      volume: '',
      price: 'R$ 0,00',
    },
    {
      brand: '',
      volume: '',
      price: 'R$ 0,00',
    },
  ]);
  const [result, setResult] = useState<CardsProps[]>([]);
  const cleanVolumeInput = (value: string) => value.replace('ml', '').trim();
  function onAddCard() {
    setCards((prev) => [
      ...prev,
      {
        brand: '',
        volume: '',
        price: 'R$ 0,00',
      },
    ]);
  }

  function onDeleteAllCards() {
    setCards([
      {
        brand: '',
        volume: '',
        price: 'R$ 0,00',
      },
      {
        brand: '',
        volume: '',
        price: 'R$ 0,00',
      },
    ]);
    toast.success('Todos os campos foram limpos');
  }

  function onDeleteCard(index: number) {
    const filteredCards = cards.filter((_, i) => i !== index);

    setCards(filteredCards);
  }

  function handleClose() {
    setResult([]);
    document.body.style.overflow = 'auto';
  }

  function calculateTotal() {
    const itemsWithPricePerLiter = cards.map((item, index) => {
      const priceNumber = parseFloat(
        item.price.replace('R$ ', '').replace(',', '.')
      );

      const volumeInLiters = Number(cleanVolumeInput(item.volume)) / 1000;

      const pricePerLiter =
        priceNumber && volumeInLiters ? priceNumber / volumeInLiters : 0;

      return {
        ...item,
        index: index + 1,
        volPerPrice: Number(pricePerLiter.toFixed(2)),
      };
    });

    const itemsOrderedByVolPerPrice = itemsWithPricePerLiter.sort(
      (a, b) => a.volPerPrice - b.volPerPrice
    );

    setResult(itemsOrderedByVolPerPrice);
  }

  function verifyErrors() {
    const someEmptyField = cards.some((card) => !card.volume || !card.price);
    const someZeroField = cards.some((card) => card.price === 'R$ 0,00');
    if (cards.length <= 1) {
      toast.error('Adicione ao menos dois cards');
    } else if (someEmptyField) {
      toast.error("O campo 'Volume' precisa ser preenchido");
    } else if (someZeroField) {
      toast.error('Os campos de preços precisam ser maiores que zero');
    }

    return cards.length <= 1 || someEmptyField || someZeroField;
  }

  return (
    <>
      <div className="pt-4 px-6 overflow-y flex flex-col items-center justify-between ">
        <div className="flex items-center relative  justify-center pb-16">
          <Image src={logo} alt="logo" />
          <Image width={45} height={45} src={IconBeer} alt='ícone de cerveja' className='absolute -top-4 -right-11'/>
        </div>
        <div>
          <div className="flex flex-col gap-4 mb-10 ">
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
        </div>

        <footer className="mt-16 pb-4 flex flex-col items-center">
          <div className="flex items-center justify-center gap-5">
            <Button
              text="Limpar"
              color="bg-red-600"
              onClick={onDeleteAllCards}
            />
            <Button
              text="Calcular"
              color="bg-green-500"
              onClick={() => {
                if (!verifyErrors()) {
                  calculateTotal();
                  document.body.style.overflow = 'hidden';
                }
              }}
            />
          </div>
          <p className="text-white text-xs mt-4 text-center">
            Desenvolvido por{' '}
            <a
              href="https://www.linkedin.com/in/guilhermezaparoli/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Guilherme Zaparoli Gomes
            </a>
          </p>
        </footer>
      </div>

      <ModalResult cards={result} close={handleClose} />
    </>
  );
}
