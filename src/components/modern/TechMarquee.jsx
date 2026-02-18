import { motion } from "framer-motion";
import { portfolioData } from "../../data/portfolio";
import styles from "./TechMarquee.module.css";

// Flatten skills for marquee
const techs = [
  ...portfolioData.skills.frontend,
  ...portfolioData.skills.backend,
  ...portfolioData.skills.tools,
  ...portfolioData.skills.scripting,
];

const MarqueeGroup = () => (
  <div className={styles.marqueeGroup}>
    {techs.map((tech, i) => (
      <span key={i} className={styles.techItem}>
        {tech}
      </span>
    ))}
  </div>
);

export default function TechMarquee() {
  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.track}>
        <MarqueeGroup />
        <MarqueeGroup />
        <MarqueeGroup />
        <MarqueeGroup />
      </div>
    </div>
  );
}
