import { useState } from 'react';
import { portfolioData } from '../../data/portfolio';
import { useWindows } from '../../context/WindowContext';
import styles from './ContactWindow.module.css';

export default function ContactWindow() {
  const { bio } = portfolioData;
  const { closeWindow } = useWindows();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(bio.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div className={styles.tabActive}>General</div>
        <div className={styles.tab}>Net</div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.row}>
          <img 
            src="/icons/user_world.png" 
            alt="User" 
            className={styles.userIcon} 
          />
          <div className={styles.info}>
            <div className={styles.field}>
              <label>Name:</label>
              <input type="text" value={bio.name} readOnly />
            </div>
            <div className={styles.field}>
              <label>Title:</label>
              <input type="text" value={bio.title} readOnly />
            </div>
            <div className={styles.field}>
              <label>E-mail:</label>
              <div className={styles.inputGroup}>
                <input type="text" value={bio.email} readOnly />
                <button 
                    onClick={handleCopy}
                    title="Copy to clipboard"
                >
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <fieldset className={styles.group}>
          <legend>Online Presence</legend>
          <div className={styles.links}>
            <a href={bio.socials.github} target="_blank" rel="noopener noreferrer" className={styles.linkItem}>
                <img src="/icons/network_internet.png" alt="" />
                <span>GitHub Profile</span>
            </a>
            <a href={bio.socials.linkedin} target="_blank" rel="noopener noreferrer" className={styles.linkItem}>
                <img src="/icons/linkedin.png" alt="" />
                <span>LinkedIn Profile</span>
            </a>
          </div>
        </fieldset>
      </div>
      
      <div className={styles.actions}>
        <button className={styles.btn} onClick={() => closeWindow('contact')}>OK</button>
        <button className={styles.btn} onClick={() => closeWindow('contact')}>Cancel</button>
      </div>
    </div>
  );
}

