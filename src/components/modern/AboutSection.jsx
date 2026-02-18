import { getTranslation } from '../../data/portfolio';
import { useLang } from '../../context/LanguageContext';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  const { lang } = useLang();
  const t = getTranslation(lang);

  return (
    <section className={styles.about}>
      <h2 className={styles.heading}>{t.about.heading}</h2>
      <div className={styles.content}>
        {t.about.paragraphs.map((text, i) => (
          <p key={i} dangerouslySetInnerHTML={{ 
            __html: text.replace(/<highlight>(.*?)<\/highlight>/g, '<span class="highlight">$1</span>') 
          }} />
        ))}
      </div>
    </section>
  );
}
