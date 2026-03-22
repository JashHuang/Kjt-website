import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-full shadow-inner border border-gray-200">
      <button
        type="button"
        onClick={() => setLanguage('tw')}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
          language === 'tw'
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-105'
            : 'text-gray-500 hover:text-amber-600'
        }`}
      >
        繁
      </button>
      <button
        type="button"
        onClick={() => setLanguage('cn')}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
          language === 'cn'
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-105'
            : 'text-gray-500 hover:text-amber-600'
        }`}
      >
        簡
      </button>
    </div>
  );
}
