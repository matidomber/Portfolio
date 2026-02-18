import { useState, useEffect, useCallback, useRef } from 'react';

export default function useResize(ref, initialSize, onResize) {
  const [isResizing, setIsResizing] = useState(false);
  
  // Use ref for stable callback reference to prevent re-attaching listeners
  const onResizeRef = useRef(onResize);
  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  const handleMouseDown = useCallback((e) => {
    e.stopPropagation(); // Prevent drag
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const newWidth = Math.max(200, e.clientX - ref.current.getBoundingClientRect().left);
      const newHeight = Math.max(150, e.clientY - ref.current.getBoundingClientRect().top);
      onResizeRef.current(newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, ref]); // Removed onResize from deps - using ref instead

  return { handleMouseDown, isResizing };
}
