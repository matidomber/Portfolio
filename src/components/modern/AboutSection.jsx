import { getTranslation } from '../../data/portfolio';
import { useLang } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import styles from './AboutSection.module.css';

/**
 * Safe highlight parser — avoids dangerouslySetInnerHTML XSS risk.
 * Converts <highlight>text</highlight> → <span className="highlight">text</span>
 */
function parseHighlights(text) {
  const parts = text.split(/(<highlight>.*?<\/highlight>)/g);
  return parts.map((part, i) => {
    const match = part.match(/^<highlight>(.*?)<\/highlight>$/);
    if (match) {
      return <span key={i} className="highlight">{match[1]}</span>;
    }
    return part;
  });
}

export default function AboutSection() {
  const { lang } = useLang();
  const t = getTranslation(lang);

  return (
    <section className={styles.about}>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {t.about.heading}
      </motion.h2>
      <div className={styles.content}>
        {t.about.paragraphs.map((text, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.8, 0.25, 1] }}
          >
            {parseHighlights(text)}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
