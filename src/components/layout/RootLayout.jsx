import { useMode } from '../../context/ModeContext';
import ThemeSwitcher from './ThemeSwitcher';
import ModernLayout from '../modern/ModernLayout';
import Win95Layout from '../win95/Win95Layout';
import { AnimatePresence, motion } from 'framer-motion';

export default function RootLayout() {
  const { mode } = useMode();

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
            <ModernLayout />
          </motion.div>
        ) : (
          <motion.div 
            key="win95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="full-screen"
          >
           <Win95Layout />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
