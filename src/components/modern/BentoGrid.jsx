import { lazy, Suspense } from "react";
import ProjectCard from "./ProjectCard";
import { portfolioData } from "../../data/portfolio";
import styles from "./BentoGrid.module.css";

// Lazy loaded — GLB/PNG load in separate chunk, not blocking initial render
const Lanyard = lazy(() => import("../../lanyard/lanyard"));

export default function BentoGrid({ projects }) {
  return (
    <div className={styles.grid}>
      {/* Primary Feature — Lanyard Card */}
      <div
        className={`${styles.cell} ${styles.cellLarge}`}
        style={{
          background: "transparent",
          boxShadow: "none",
          overflow: "visible",
        }}
      >
        {/* Suspense catches: 1) lazy module load 2) useGLTF suspension inside Canvas */}
        <Suspense fallback={<LanyardSkeleton />}>
          <Lanyard position={[0, -6, 15]} gravity={[0, -40, 0]} />
        </Suspense>
      </div>

      {/* Project Cards */}
      {projects.map((project, index) => (
        <div
          key={project.id}
          className={styles.cell}
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <ProjectCard project={project} />
        </div>
      ))}

      {/* Stack Highlights */}
      <div className={`${styles.cell} ${styles.cellTall}`}>
        <div className={styles.decor}>
          <span className={styles.decorLabel}>STACK</span>
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

function LanyardSkeleton() {
  return (
    <div className={styles.lanyardSkeleton}>
      <div className={styles.skeletonCard} />
    </div>
  );
}
