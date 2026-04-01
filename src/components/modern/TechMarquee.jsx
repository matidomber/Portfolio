import { portfolioData } from "../../data/portfolio";
import styles from "./TechMarquee.module.css";

// Flatten all skills
const techs = [
  ...portfolioData.skills.frontend,
  ...portfolioData.skills.backend,
  ...portfolioData.skills.tools,
  ...portfolioData.skills.scripting,
];

// Two groups are enough for a seamless loop
function MarqueeGroup() {
  return (
    <div className={styles.marqueeGroup} aria-hidden="true">
      {techs.map((tech, i) => (
        <span key={i} className={styles.techItem}>
          {tech}
        </span>
      ))}
    </div>
  );
}

export default function TechMarquee() {
  return (
    <div className={styles.marqueeContainer} aria-label="Technology stack">
      <div className={styles.track}>
        {/* Duplicate for seamless loop — CSS handles it, no JS needed */}
        <MarqueeGroup />
        <MarqueeGroup />
      </div>
    </div>
  );
}
