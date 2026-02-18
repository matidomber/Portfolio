import { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';

const WindowContext = createContext();

export const WindowProvider = ({ children }) => {
  const [windows, setWindows] = useState([]); // [{ id, title, content, isOpen, isMinimized, position: {x,y}, zIndex }]
  const [activeWindowId, setActiveWindowId] = useState(null);
  
  // Use ref for zIndex to avoid stale closure issues
  const zIndexRef = useRef(100);

  const openWindow = useCallback((id, title, content, initialSize = { width: 400, height: 300 }) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        // Bring to front - update in place
        zIndexRef.current += 1;
        return prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: zIndexRef.current } : w);
      }
      // Open new window
      zIndexRef.current += 1;
      return [...prev, {
        id,
        title,
        content,
        isOpen: true,
        isMinimized: false,
        position: { x: 50 + prev.length * 20, y: 50 + prev.length * 20 }, // Cascade
        size: initialSize,
        zIndex: zIndexRef.current
      }];
    });
    setActiveWindowId(id);
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const focusWindow = useCallback((id) => {
    setActiveWindowId(prevActive => {
      if (prevActive === id) return prevActive;
      return id;
    });
    setWindows(prev => {
      zIndexRef.current += 1;
      return prev.map(w => w.id === id ? { ...w, zIndex: zIndexRef.current } : w);
    });
  }, []);

  const moveWindow = useCallback((id, x, y) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  }, []);

  const resizeWindow = useCallback((id, width, height) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size: { width, height } } : w));
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ 
    windows, 
    openWindow, 
    closeWindow, 
    focusWindow,
    moveWindow,
    resizeWindow,
    activeWindowId 
  }), [windows, openWindow, closeWindow, focusWindow, moveWindow, resizeWindow, activeWindowId]);

  return (
    <WindowContext.Provider value={contextValue}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindows = () => useContext(WindowContext);
