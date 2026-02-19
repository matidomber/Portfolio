import { portfolioData, getCVTranslation } from '../../data/portfolio';
import { useLang } from '../../context/LanguageContext';
import styles from './CVPage.module.css';

export default function CVPage({ onClose }) {
  const { lang, toggleLang } = useLang();
  const cv = getCVTranslation(lang);
  const { bio, skills } = portfolioData;
  const { phone, dob, location } = portfolioData.cv;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.overlay}>
      {/* Toolbar - hidden in print */}
      <div className={styles.toolbar}>
        <button className={styles.toolBtn} onClick={onClose}>
          ← {cv.close}
        </button>
        <div className={styles.toolRight}>
          <button className={styles.langBtn} onClick={toggleLang}>
            {lang === 'pl' ? 'EN' : 'PL'}
          </button>
          <button className={styles.printBtn} onClick={handlePrint}>
            📄 {cv.download}
          </button>
        </div>
      </div>

      {/* CV Content - this is what gets printed */}
      <div className={styles.page} id="cv-page">
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.name}>{bio.name}</h1>
            <p className={styles.titleRole}>{bio.title}</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>{cv.labels.phone}:</span>
              <span>{phone}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>{cv.labels.email}:</span>
              <a href={`mailto:${bio.email}`}>{bio.email}</a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>{cv.labels.location}:</span>
              <span>{location}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>{cv.labels.dob}:</span>
              <span>{dob}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>{cv.labels.github}:</span>
              <a href={bio.socials.github} target="_blank" rel="noreferrer">github.com/matidomber</a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>{cv.labels.linkedin}:</span>
              <a href={bio.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </header>

        <hr className={styles.divider} />

        {/* Objective */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cv.sections.objective}</h2>
          <p className={styles.objective}>{cv.objective}</p>
        </section>

        {/* Experience */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cv.sections.experience}</h2>
          {cv.experience.map((exp, i) => (
            <div key={i} className={styles.entry}>
              <div className={styles.entryHeader}>
                <div>
                  <strong className={styles.entryRole}>{exp.role}</strong>
                  <span className={styles.entryCompany}> — {exp.company}</span>
                </div>
                <span className={styles.entryPeriod}>{exp.period}</span>
              </div>
              <ul className={styles.duties}>
                {exp.duties.map((duty, j) => (
                  <li key={j}>{duty}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cv.sections.education}</h2>
          {cv.education.map((edu, i) => (
            <div key={i} className={styles.entry}>
              <div className={styles.entryHeader}>
                <div>
                  <strong className={styles.entryRole}>{edu.school}</strong>
                  <span className={styles.entryCompany}> — {edu.degree}</span>
                </div>
                <span className={styles.entryPeriod}>{edu.period}</span>
              </div>
              {edu.specialization && (
                <p className={styles.specialization}>{edu.specialization}</p>
              )}
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cv.sections.skills}</h2>
          <div className={styles.skillsGrid}>
            <div className={styles.skillGroup}>
              <span className={styles.skillLabel}>Frontend:</span>
              <span>{skills.frontend.join(', ')}</span>
            </div>
            <div className={styles.skillGroup}>
              <span className={styles.skillLabel}>Backend:</span>
              <span>{skills.backend.join(', ')}</span>
            </div>
            <div className={styles.skillGroup}>
              <span className={styles.skillLabel}>Tools:</span>
              <span>{skills.tools.join(', ')}</span>
            </div>
          </div>
        </section>

        {/* Certificates */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cv.sections.certificates}</h2>
          <ul className={styles.simpleList}>
            {cv.certificates.map((cert, i) => (
              <li key={i}>{cert}</li>
            ))}
          </ul>
        </section>

        {/* Languages */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cv.sections.languages}</h2>
          <div className={styles.langList}>
            {cv.languages.map((l, i) => (
              <span key={i} className={styles.langItem}>
                <strong>{l.name}</strong> — {l.level}
              </span>
            ))}
          </div>
        </section>

        {/* Interests */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cv.sections.interests}</h2>
          <p>{cv.interests}</p>
        </section>

        {/* RODO */}
        <footer className={styles.rodo}>
          <p>{cv.rodo}</p>
        </footer>
      </div>
    </div>
  );
}
