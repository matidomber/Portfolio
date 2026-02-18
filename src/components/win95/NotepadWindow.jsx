import { portfolioData, getLocalizedExperience } from '../../data/portfolio';
import { useLang } from '../../context/LanguageContext';
import styles from './NotepadWindow.module.css';

export default function NotepadWindow() {
  const { lang } = useLang();
  const { bio } = portfolioData;
  const experience = getLocalizedExperience(lang);

  const content = `
RESUME.TXT - ${bio.name}

----------------------------------------
EXPERIENCE
----------------------------------------

${experience.map(item => `
[${item.period}] ${item.role} @ ${item.company}
> ${item.description}
`).join('\n')}

----------------------------------------
EDUCATION & SKILLS
----------------------------------------

EDUCATION:
[2022 - 2026] Informatyka Inżynierska @ UKW Bydgoszcz

TECHNICAL SKILLS:
${Object.entries(portfolioData.skills).map(([category, items]) => `
[${category.toUpperCase()}]
${items.join(', ')}
`).join('')}

EOF
  `;

  return (
    <div className={styles.container}>
      <div className={styles.menubar}>
        <span>File</span>
        <span>Edit</span>
        <span>Search</span>
        <span>Help</span>
      </div>
      <textarea 
        className={styles.textarea} 
        value={content} 
        readOnly 
        spellCheck="false"
      />
    </div>
  );
}

