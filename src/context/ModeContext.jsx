import { createContext, useContext, useState } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  // Lazy init from localStorage to avoid flash-of-wrong-theme
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem('portfolio-mode') || 'modern';
    } catch {
      return 'modern';
    }
  });

  const toggleMode = () => {
    const newMode = mode === 'modern' ? 'win95' : 'modern';
    setMode(newMode);
    try {
      localStorage.setItem('portfolio-mode', newMode);
    } catch {
      // localStorage unavailable (e.g. private browsing)
    }
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};
