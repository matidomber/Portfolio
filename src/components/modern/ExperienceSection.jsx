import { getTranslation, getLocalizedExperience } from '../../data/portfolio';
import { useLang } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import styles from './ExperienceSection.module.css';

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] } },
};

export default function ExperienceSection() {
  const { lang } = useLang();
  const t = getTranslation(lang);
  const experience = getLocalizedExperience(lang);

  return (
    <section className={styles.container}>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        {t.ui.experienceHeading}
      </motion.h2>
      <div className={styles.timeline}>
        {experience.map((item, index) => (
          <motion.div
            key={item.id}
            className={styles.item}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.period}>{item.period}</div>
            <div className={styles.content}>
              <h3 className={styles.role}>{item.role}</h3>
              <div className={styles.company}>{item.company}</div>
              <p className={styles.desc}>{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
