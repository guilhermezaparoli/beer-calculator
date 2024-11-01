import { Plus } from 'lucide-react';

type BeerAddCardProps = {
  onAddCard: () => void;
};
export function BeerAddCard({ onAddCard }: BeerAddCardProps) {
  return (
    <button className=" w-full flex gap-2 items-center justify-center py-5 rounded-xl border border-dashed" onClick={onAddCard}>
      <Plus className="text-white" size={24} />
      <p className="text-white text-sm font-semibold">ADICIONAR CERVEJA</p>
    </button>
  );
}
