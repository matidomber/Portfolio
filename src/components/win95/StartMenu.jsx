import styles from './StartMenu.module.css';

export default function StartMenu({ onClose, onShutdown }) {
  // Simple items - using local icons
  const items = [
    { icon: '/icons/directory.png', label: 'Programs' },
    { icon: '/icons/directory.png', label: 'Documents' },
    { icon: '/icons/settings_gear.png', label: 'Settings' },
    { icon: '/icons/search_file.png', label: 'Find' },
    { icon: '/icons/help_book.png', label: 'Help' },
    { icon: '/icons/run.png', label: 'Run...' },
    { separator: true },
    { icon: '/icons/shutdown.png', label: 'Shut Down...', action: 'shutdown' }
  ];


  const handleItemClick = (item) => {
    if (item.action === 'shutdown') {
       onShutdown();
       onClose();
       return;
    }
    onClose();
  };

  return (
    <div className={styles.startMenu} role="menu" aria-label="Start menu">
      <div className={styles.sidebar} aria-hidden="true">
        <span className={styles.sidebarText}><strong>Windows</strong>95</span>
      </div>
      <div className={styles.content}>
        {items.map((item, index) => 
          item.separator ? (
            <div key={index} className={styles.separator} role="separator" />
          ) : (
            <div 
              key={index} 
              className={styles.item} 
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleItemClick(item);
                }
              }}
              role="menuitem"
              tabIndex={0}
              aria-label={item.label}
            >
              <img src={item.icon} alt="" className={styles.icon} aria-hidden="true" />
              <span className={styles.label}>{item.label}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
