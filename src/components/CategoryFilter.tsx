import { useLanguage } from '../contexts/LanguageContext';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const { convert } = useLanguage();
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          onClick={() => onSelect(category)}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
            selected === category
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
              : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
          }`}
        >
          {convert(category)}
        </button>
      ))}
    </div>
  );
}
