import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  const { convert } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 shadow-lg md:backdrop-blur-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex h-18 items-center justify-between md:h-20">
          <a href="#home" className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg md:h-10 md:w-10">
              <span className="text-2xl text-white md:text-xl">佛</span>
            </div>
            <span className="truncate text-2xl font-bold text-gray-800 font-chinese md:text-xl">
              {convert('寬覺堂')}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
              {convert('首頁')}
            </a>
            <a href="#articles" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
              {convert('文章')}
            </a>
            <a href="#footer" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
              {convert('關於')}
            </a>
            <LanguageToggle />
            <a href="#articles" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg">
              {convert('開始閱讀')}
            </a>
          </div>

          <button 
            className="rounded-full p-3 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-8 w-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white/95 py-5 md:hidden md:backdrop-blur-md">
            <div className="flex flex-col gap-4 px-4">
              <a href="#home" className="py-2 text-lg font-medium text-gray-700 transition-colors hover:text-amber-600">
                {convert('首頁')}
              </a>
              <a href="#articles" className="py-2 text-lg font-medium text-gray-700 transition-colors hover:text-amber-600">
                {convert('文章')}
              </a>
              <a href="#footer" className="py-2 text-lg font-medium text-gray-700 transition-colors hover:text-amber-600">
                {convert('關於')}
              </a>
              <div className="py-2">
                <LanguageToggle />
              </div>
              <a href="#articles" className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-center text-lg font-medium text-white">
                {convert('開始閱讀')}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
