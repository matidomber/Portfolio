import { createContext, useContext, useState, useCallback, useMemo } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('portfolio-lang') || 'pl';
    } catch {
      return 'pl';
    }
  });

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'pl' ? 'en' : 'pl';
      try { localStorage.setItem('portfolio-lang', next); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ lang, toggleLang }), [lang, toggleLang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
