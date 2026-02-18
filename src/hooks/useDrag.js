import { useState, useEffect, useCallback } from 'react';

export default function useDrag(ref, initialPosition, onDrag, enable = true) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    if (!enable || !ref.current) return;
    // Only drag from handle (title bar)
    if (e.target.getAttribute('data-drag-handle') !== 'true') return;

    setIsDragging(true);
    setOffset({
      x: e.clientX - initialPosition.x,
      y: e.clientY - initialPosition.y
    });
  }, [enable, initialPosition, ref]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;
    
    if (onDrag) onDrag(newX, newY);
  }, [isDragging, offset, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return { handleMouseDown, isDragging };
}
