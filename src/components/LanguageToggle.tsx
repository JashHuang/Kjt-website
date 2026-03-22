import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-gray-200 bg-gray-100 p-1.5 shadow-inner">
      <button
        type="button"
        onClick={() => setLanguage('tw')}
        className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
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
        className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
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
