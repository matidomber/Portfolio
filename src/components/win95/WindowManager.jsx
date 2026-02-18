import { useWindows } from '../../context/WindowContext';
import WindowFrame from './WindowFrame';

export default function WindowManager() {
  const { windows } = useWindows();

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'calc(100% - 40px)', pointerEvents: 'none' }}>
      {windows.map(window => (
        <div key={window.id} style={{ pointerEvents: 'auto' }}>
           <WindowFrame window={window} />
        </div>
      ))}
    </div>
  );
}
