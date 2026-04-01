import { lazy, Suspense } from "react";
import ProjectCard from "./ProjectCard";
import { portfolioData } from "../../data/portfolio";
import styles from "./BentoGrid.module.css";

// Lazy load Lanyard — splits it into a separate chunk
// The 3D scene (card.glb ~3.3MB + lanyard.png ~1.6MB) loads asynchronously
// so the rest of the page is immediately interactive
const Lanyard = lazy(() => import("../../lanyard/lanyard"));

function LanyardSkeleton() {
  return (
    <div className={styles.lanyardSkeleton}>
      <div className={styles.skeletonCard} />
    </div>
  );
}

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
