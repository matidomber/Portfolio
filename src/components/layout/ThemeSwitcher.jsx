import { useMode } from '../../context/ModeContext';
import styles from './ThemeSwitcher.module.css'; // We will create this

export default function ThemeSwitcher() {
  const { mode, toggleMode } = useMode();

  return (
    <button 
      className={`${styles.switcher} ${mode === 'win95' ? styles.win95 : styles.modern}`} 
      onClick={toggleMode}
      aria-label={`Switch to ${mode === 'modern' ? 'Windows 95' : 'Modern'} theme`}
    >
      {mode === 'modern' ? 'Go Retro 💾' : 'Go Modern 🚀'}
    </button>
  );
}
