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

function getStoredLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'tw';
  }

  try {
    const stored = window.localStorage.getItem('preferred-language');
    return stored === 'cn' || stored === 'tw' ? stored : 'tw';
  } catch {
    return 'tw';
  }
}

function persistLanguage(language: Language) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem('preferred-language', language);
  } catch {
    // Ignore storage failures on restricted mobile browsers/webviews.
  }
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setInternalLanguage] = useState<Language>(getStoredLanguage);

  const [converter, setConverter] = useState<any>(null);

  useEffect(() => {
    if (language === 'cn') {
      const conv = OpenCC.Converter({ from: 'hk', to: 'cn' });
      setConverter(() => conv);
    } else {
      setConverter(null);
    }
    persistLanguage(language);
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
