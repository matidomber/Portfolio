import { useState } from 'react';
import { useMode } from '../../context/ModeContext';
import ThemeSwitcher from './ThemeSwitcher';
import ModernLayout from '../modern/ModernLayout';
import Win95Layout from '../win95/Win95Layout';
import CVPage from '../cv/CVPage';
import { AnimatePresence, motion } from 'framer-motion';

export default function RootLayout() {
  const { mode } = useMode();
  const [showCV, setShowCV] = useState(false);

  return (
    <>
      <ThemeSwitcher />
      <AnimatePresence mode="wait">
        {mode === 'modern' ? (
          <motion.div 
            key="modern"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="full-screen"
            style={{ background: 'var(--modern-bg)', color: 'var(--modern-text)' }}
          >
            {/* Placeholder for Modern Container */}
            <ModernLayout onOpenCV={() => setShowCV(true)} />
          </motion.div>
        ) : (
          <motion.div 
            key="win95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="full-screen"
          >
           <Win95Layout onOpenCV={() => setShowCV(true)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {showCV && <CVPage onClose={() => setShowCV(false)} />}
    </>
  );
}
