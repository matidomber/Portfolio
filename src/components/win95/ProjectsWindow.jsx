import { portfolioData } from '../../data/portfolio';
import styles from './ProjectsWindow.module.css';

export default function ProjectsWindow() {
  return (
    <div className={styles.container}>
      <div className={styles.menubar}>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Help</span>
      </div>
      <div className={styles.content}>
        {portfolioData.projects.map((project) => (
          <div 
            key={project.id} 
            className={styles.item}
            onDoubleClick={() => window.open(project.link, '_blank')}
            style={{ cursor: 'pointer' }}
          >
            <img 
              src="/icons/html.png" 
              alt="html" 
              className={styles.icon}
            />
            <span className={styles.label}>{project.title}</span>
            <span className={styles.type}>{project.type}</span>
          </div>
        ))}
      </div>
      <div className={styles.statusbar}>
        {portfolioData.projects.length} object(s)
      </div>
    </div>
  );
}

