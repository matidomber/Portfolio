import { useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import BentoGrid from './BentoGrid';
import { portfolioData, getLocalizedProjects, getCVTranslation } from '../../data/portfolio';
import { useLang } from '../../context/LanguageContext';
import SplitText from './SplitText';
import TechMarquee from './TechMarquee';
import AboutSection from './AboutSection';
import ExperienceSection from './ExperienceSection';
import SkillsSection from './SkillsSection';
import ContactSection from './ContactSection';
import Noise from './Noise';
import SmoothScroll from '../shared/SmoothScroll';
import styles from './ModernLayout.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function ModernLayout({ onOpenCV }) {
  const containerRef = useRef(null);
  const { lang, toggleLang } = useLang();
  const localizedProjects = getLocalizedProjects(lang);
  const cvT = getCVTranslation(lang);

  return (
    <SmoothScroll containerRef={containerRef}>
      <Motion.main 
        ref={containerRef}
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        <Noise />
        <header className={styles.header}>
          <div className={styles.brand}>
            <h1>
              <SplitText delay={0.2}>{portfolioData.bio.firstName}</SplitText>
            </h1>
            <p>
              <SplitText delay={0.4}>{portfolioData.bio.title}</SplitText>
            </p>
          </div>
          <div className={styles.nav}>
            <button 
              className={styles.langToggle} 
              onClick={toggleLang}
              aria-label="Toggle language"
            >
              {lang === 'pl' ? 'EN' : 'PL'}
            </button>
            <button 
              className={styles.langToggle} 
              onClick={onOpenCV}
              aria-label="Download CV"
            >
              📄 {cvT.download}
            </button>
            <span>2026 / PORTFOLIO</span>
          </div>
        </header>

        <section className={styles.gridSection}>
          <BentoGrid projects={localizedProjects} />
        </section>

        <TechMarquee />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />
        
        <footer className={styles.footer}>
          &copy; 2026 {portfolioData.bio.name}. All rights reserved.
        </footer>
      </Motion.main>
    </SmoothScroll>
  );
}
