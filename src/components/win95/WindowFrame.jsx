import { useRef } from 'react';
import { useWindows } from '../../context/WindowContext';
import useDrag from '../../hooks/useDrag';
import useResize from '../../hooks/useResize';
import styles from './WindowFrame.module.css';
import { X } from 'lucide-react';

export default function WindowFrame({ window }) {
  const { closeWindow, focusWindow, moveWindow, resizeWindow, activeWindowId } = useWindows();
  const windowRef = useRef(null);
  
  const isActive = activeWindowId === window.id;

  const { handleMouseDown: handleDrag } = useDrag(windowRef, window.position, (x, y) => {
    moveWindow(window.id, x, y);
  });

  const { handleMouseDown: handleResize } = useResize(windowRef, window.size, (w, h) => {
    resizeWindow(window.id, w, h);
  });

  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${isActive ? styles.active : ''}`}
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size?.width || 300,
        height: window.size?.height || 200, // Use context size or fallback
        zIndex: window.zIndex,
      }}
      onMouseDown={() => focusWindow(window.id)}
      role="dialog"
      aria-labelledby={`window-title-${window.id}`}
      aria-modal="false"
    >
      <div 
        className={`${styles.titleBar} ${isActive ? styles.titleBarActive : ''}`}
        onMouseDown={handleDrag}
        data-drag-handle="true"
      >
        <span 
          id={`window-title-${window.id}`}
          className={styles.title} 
          data-drag-handle="true"
        >
          {window.title}
        </span>
        <button 
          className={styles.closeBtn}
          aria-label={`Close ${window.title}`}
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
          onKeyDown={(e) => { 
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              closeWindow(window.id);
            }
          }}
        >
          <X size={12} strokeWidth={3} />
        </button>
      </div>

      <div className={styles.content}>
        {window.content}
      </div>

      {/* Resize Handle */}
      <div className={styles.resizeHandle} onMouseDown={handleResize} aria-hidden="true" />
    </div>
  );
}
