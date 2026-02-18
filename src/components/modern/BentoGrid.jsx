import { motion as Motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import Lanyard from "../../lanyard/lanyard";
import { portfolioData } from "../../data/portfolio";
import styles from "./BentoGrid.module.css";

export default function BentoGrid({ projects }) {
  return (
    <div className={styles.grid}>
      {/* Primary Feature - Lanyard Card */}
      <Motion.div
        className={`${styles.cell} ${styles.cellLarge}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "transparent",
          boxShadow: "none",
          overflow: "visible",
        }} // Override for 3D context
      >
        <Lanyard position={[0, -6, 15]} gravity={[0, -40, 0]} />
      </Motion.div>

      {/* Project Cards */}
      {projects.map((project, index) => (
        <Motion.div
          key={project.id}
          className={styles.cell}
          style={{ margin: "10px" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProjectCard project={project} />
        </Motion.div>
      ))}

      {/* Stack Highlights */}
      <div className={`${styles.cell} ${styles.cellTall}`}>
        <div className={styles.decor}>
          <span>STACK</span>
          <ul>
            {portfolioData.stackHighlights.map(s => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
