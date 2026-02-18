import { portfolioData, getTranslation } from '../../data/portfolio';
import { useLang } from '../../context/LanguageContext';
import styles from './SkillsSection.module.css';
import { Code, Server, Wrench, Terminal } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const iconMap = {
  frontend: <Code size={32} />,
  backend: <Server size={32} />,
  tools: <Wrench size={32} />,
  scripting: <Terminal size={32} />
};

export default function SkillsSection() {
  const { skills } = portfolioData;
  const { lang } = useLang();
  const t = getTranslation(lang);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{t.ui.skillsHeading}</h2>
      
      <div className={styles.grid}>
        {Object.entries(skills).map(([category, items], index) => (
          <Motion.div 
            key={category}
            className={styles.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.catHeader}>
              {iconMap[category]}
              <h3 className={styles.catTitle}>{category}</h3>
            </div>
            <ul className={styles.list}>
              {items.map(item => (
                <li key={item} className={styles.item}>{item}</li>
              ))}
            </ul>
          </Motion.div>
        ))}
      </div>
    </section>
  );
}
