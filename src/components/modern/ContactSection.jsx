import { useState } from 'react';
import { portfolioData, getTranslation } from '../../data/portfolio';
import { useLang } from '../../context/LanguageContext';
import { Github, Linkedin, Copy, Check } from 'lucide-react';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const { bio } = portfolioData;
  const { lang } = useLang();
  const t = getTranslation(lang);

  const handleCopy = () => {
    navigator.clipboard.writeText(bio.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>{t.ui.contactHeading}</h2>
      <p className={styles.subheading}>{t.ui.contactSubheading}</p>
      
      <div className={styles.emailWrapper} onClick={handleCopy}>
        <span className={styles.email}>{bio.email}</span>
        <button className={styles.copyBtn} aria-label="Copy email">
          {copied ? <Check size={20} color="#0dff00ff" /> : <Copy size={20} />}
        </button>
        <span className={styles.copyTooltip}>{copied ? t.ui.copied : t.ui.copyTooltip}</span>
      </div>

      <div className={styles.socials}>
        <a href={bio.socials.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <Github size={24} />
            <span>GitHub</span>
        </a>
        <a href={bio.socials.linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <Linkedin size={24} />
            <span>LinkedIn</span>
        </a>
      </div>
    </section>
  );
}

