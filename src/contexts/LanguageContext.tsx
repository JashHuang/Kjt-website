import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as OpenCC from 'opencc-js';

type Language = 'tw' | 'cn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  convert: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setInternalLanguage] = useState<Language>(() => {
    return (localStorage.getItem('preferred-language') as Language) || 'tw';
  });

  const [converter, setConverter] = useState<any>(null);

  useEffect(() => {
    if (language === 'cn') {
      const conv = OpenCC.Converter({ from: 'hk', to: 'cn' });
      setConverter(() => conv);
    } else {
      setConverter(null);
    }
    localStorage.setItem('preferred-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setInternalLanguage(lang);
  };

  const convert = (text: string): string => {
    if (language === 'cn' && converter) {
      return converter(text);
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, convert }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
