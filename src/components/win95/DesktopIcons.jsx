import { useState, useEffect } from 'react';
import { useWindows } from '../../context/WindowContext';
import ProjectsWindow from './ProjectsWindow';
import ComputerWindow from './ComputerWindow';
import ContactWindow from './ContactWindow';
import NotepadWindow from './NotepadWindow';
import styles from './DesktopIcons.module.css';

const icons = [
  { id: 'computer', label: 'My Computer', icon: '/icons/computer.png' },
  { id: 'recycle', label: 'Recycle Bin', icon: '/icons/recycle_bin.png' },
  { id: 'projects', label: 'My Projects', icon: '/icons/directory.png' },
  { id: 'contact', label: 'Contact', icon: '/icons/contact.png' },
  { id: 'resume', label: 'Resume.txt', icon: '/icons/notepad.png' },
];

export default function DesktopIcons() {
  const { openWindow } = useWindows();
  const [selectedIconId, setSelectedIconId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpen = (icon) => {
    let content;
    let initialSize = { width: 400, height: 300 }; // Default size

    switch(icon.id) {
      case 'projects':
        content = <ProjectsWindow />;
        initialSize = { width: 450, height: 350 };
        break;
      case 'computer':
        content = <ComputerWindow />;
        initialSize = { width: 480, height: 360 };
        break;
      case 'contact':
        content = <ContactWindow />;
        initialSize = { width: 500, height: 360 };
        break;
      case 'resume':
        content = <NotepadWindow />;
        initialSize = { width: 1200, height: 700 }; // Larger for full resume readability
        break;
      case 'recycle':
        content = <div style={{ padding: 20, textAlign: 'center' }}>The Recycle Bin is empty.</div>;
        break;
      default:
        content = <div>Content not found</div>;
    }
    openWindow(icon.id, icon.label, content, initialSize);
  };

  const handleClick = (icon) => {
    setSelectedIconId(icon.id);
    if (isMobile) {
      handleOpen(icon);
    }
  };

  return (
    <div className={styles.iconGrid} onClick={(e) => {
      // Deselect if clicking background
      if (e.target === e.currentTarget) setSelectedIconId(null);
    }}>
      {icons.map((icon) => (
        <div 
          key={icon.id} 
          className={`${styles.iconWrapper} ${selectedIconId === icon.id ? styles.selected : ''}`}
          onClick={() => handleClick(icon)}
          onDoubleClick={() => !isMobile && handleOpen(icon)}
          role="button"
          tabIndex={0}
          aria-label={`Open ${icon.label}`}
          onKeyDown={(e) => e.key === 'Enter' && handleOpen(icon)}
        >
          <img src={icon.icon} alt="" className={styles.iconImg} />
          <span className={styles.iconLabel}>{icon.label}</span>
        </div>
      ))}
    </div>
  );
}
