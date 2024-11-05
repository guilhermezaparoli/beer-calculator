'use client'

import { X } from "lucide-react";

type Item = {
    brand: string;
    vol: string;
    price:string;
    volPerPrice: string;
    index?: number
}

type ResultProps = {
    item: Item | null;
    close: () => void
}

export function ModalResult({item, close}: ResultProps) { 
 
  return item &&  <div className='absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50'>
  <div className='p-5 bg-gray600 rounded-lg'>
<X onClick={close}/>
  <p className='text-white'>
    A cerveja {item?.index} possui o melhor preço/l {item.volPerPrice}
  </p>
  </div>
  
</div>;
}