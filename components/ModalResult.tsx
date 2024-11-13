'use client';

import { X } from 'lucide-react';

type Item = {
  brand: string;
  volume: string;
  price: string;
  volPerPrice?: number | null;
  index?: number;
};

type ResultProps = {
  cards: Item[];
  close: () => void;
};

export function ModalResult({ cards, close }: ResultProps) {

  return (
    cards.length > 0 && (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-5">
        <div className="relative p-6 bg-gray-700 rounded-lg w-full max-w-lg">
          <X onClick={close} className="text-red-500 absolute top-2 right-2 cursor-pointer" />
          <h1 className="text-white text-xl font-semibold mb-4">Resultado das Melhores Opções:</h1>
          <div className="text-white space-y-4 overflow-auto max-h-96 h-screen">
            {cards.map((card, index) => {
              // Determine the style based on volPerPrice similarity
              let styleClass = 'border-gray-700';
              let label = '';

              if (index === 0 || card.volPerPrice === cards[0].volPerPrice) {
                styleClass = 'border-green-500 bg-green-100 bg-opacity-10';
                label = 'Melhor opção';
              } else if (index === 1 || card.volPerPrice === cards[1].volPerPrice) {
                styleClass = 'border-yellow-500 bg-yellow-100 bg-opacity-10';
                label = 'Segunda melhor opção';
              } else if (index === 2 || card.volPerPrice === cards[2].volPerPrice) {
                styleClass = 'border-blue-500 bg-blue-100 bg-opacity-10';
                label = 'Terceira melhor opção';
              }

              return (
                <div key={card.index} className={`border rounded-lg p-4 w-full ${styleClass}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className={`text-lg font-bold ${styleClass.split(' ')[0]}`}>
                      {index + 1}º Lugar
                    </h2>
                    {label && <span className={`text-xs font-medium ${styleClass.split(' ')[0]}`}>{label}</span>}
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold">Número:</span>
                    <span>Cerveja {card.index}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold">Marca:</span>
                    <span>{card.brand || 'Não informada'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold">Volume (ml):</span>
                    <span>{card.volume}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold">Preço:</span>
                    <span>{card.price}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold">Preço por litro:</span>
                    <span>{card.volPerPrice?.toLocaleString("pt-br", {style: "currency", currency: "BRL"})}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
}
