import { useState, useEffect, useRef } from 'react';
import { useWindows } from '../../context/WindowContext';
import styles from './Taskbar.module.css';
import StartMenu from './StartMenu';

export default function Taskbar({ onShutdown }) {
  const [time, setTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const { windows, activeWindowId, focusWindow } = useWindows();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest(`.${styles.startButton}`)) {
        setStartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {startOpen && (
        <div ref={menuRef}>
          <StartMenu onClose={() => setStartOpen(false)} onShutdown={onShutdown} />
        </div>
      )}
      <div className={styles.taskbar}>
        <button 
          className={`${styles.startButton} ${startOpen ? styles.activeTask : ''}`}
          onClick={() => setStartOpen(!startOpen)}
        >
          <img src="/icons/windows.png" alt="win" className={styles.startIcon} />
          <span className={styles.startText}>Start</span>
        </button>

      <div className={styles.taskItems}>
         {windows.map(win => (
            <button 
                key={win.id}
                className={`${styles.taskButton} ${activeWindowId === win.id ? styles.activeTask : ''}`}
                onClick={() => focusWindow(win.id)}
            >
                <img src="/icons/directory.png" alt="" style={{width:16,height:16,marginRight:5}}/>
                {win.title}
            </button>
         ))}
      </div>

      <div className={styles.tray}>
        <div className={styles.clock}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
    </>
  );
}
