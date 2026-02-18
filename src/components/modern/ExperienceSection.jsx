import { getTranslation, getLocalizedExperience } from '../../data/portfolio';
import { useLang } from '../../context/LanguageContext';
import styles from './ExperienceSection.module.css';

export default function ExperienceSection() {
  const { lang } = useLang();
  const t = getTranslation(lang);
  const experience = getLocalizedExperience(lang);

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>{t.ui.experienceHeading}</h2>
      <div className={styles.timeline}>
        {experience.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.period}>{item.period}</div>
            <div className={styles.content}>
              <h3 className={styles.role}>{item.role}</h3>
              <div className={styles.company}>{item.company}</div>
              <p className={styles.desc}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

