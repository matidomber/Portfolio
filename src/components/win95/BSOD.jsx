import { useEffect } from 'react';
import styles from './BSOD.module.css';

export default function BSOD({ onReset }) {
  useEffect(() => {
    const handleKeyDown = () => onReset();
    const handleClick = () => onReset();

    // Delay attaching listeners to avoid immediate trigger from the click that opened this
    const timer = setTimeout(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClick);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [onReset]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.header}>Windows</p>
        <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36. The current application will be terminated.</p>
        
        <ul className={styles.list}>
          <li>* Press any key to terminate the current application.</li>
          <li>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
        </ul>

        <p className={styles.center}>Press any key to continue _</p>
      </div>
    </div>
  );
}
