import { useLanguage } from '../contexts/LanguageContext';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const { convert } = useLanguage();
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          onClick={() => onSelect(category)}
          className={`min-w-[132px] rounded-full px-6 py-3 text-lg font-medium transition-all duration-300 md:min-w-0 md:px-6 md:py-2 md:text-base ${
            selected === category
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
              : 'border border-gray-200 bg-white/90 text-gray-700 hover:bg-white hover:shadow-md md:bg-white/80 md:backdrop-blur-sm'
          }`}
        >
          {convert(category)}
        </button>
      ))}
    </div>
  );
}
