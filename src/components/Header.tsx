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
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-20">
          <a href="#home" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">佛</span>
            </div>
            <span className="text-xl font-bold text-gray-800 font-chinese">
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
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 py-4">
            <div className="flex flex-col gap-4 px-4">
              <a href="#home" className="text-gray-700 hover:text-amber-600 transition-colors font-medium py-2">
                {convert('首頁')}
              </a>
              <a href="#articles" className="text-gray-700 hover:text-amber-600 transition-colors font-medium py-2">
                {convert('文章')}
              </a>
              <a href="#footer" className="text-gray-700 hover:text-amber-600 transition-colors font-medium py-2">
                {convert('關於')}
              </a>
              <div className="py-2">
                <LanguageToggle />
              </div>
              <a href="#articles" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full font-medium">
                {convert('開始閱讀')}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
