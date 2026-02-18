import { useState } from 'react';
import { WindowProvider } from '../../context/WindowContext';
import styles from './Win95Layout.module.css';
import Taskbar from './Taskbar';
import DesktopIcons from './DesktopIcons';
import WindowManager from './WindowManager';
import BSOD from './BSOD';

export default function Win95Layout() {
  const [isBsod, setIsBsod] = useState(false);

  if (isBsod) {
    return <BSOD onReset={() => window.location.reload()} />;
  }

  return (
    <WindowProvider>
      <div className={styles.desktop}>
        <DesktopIcons />
        <WindowManager />
        <Taskbar onShutdown={() => setIsBsod(true)} />
      </div>
    </WindowProvider>
  );
}
