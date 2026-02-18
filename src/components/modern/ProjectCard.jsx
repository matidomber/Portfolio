import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project }) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <article
      ref={divRef}
      className={styles.card}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
    >
      <div
        className={styles.spotlight}
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0,0,0,0.06), transparent 40%)`,
        }}
        aria-hidden="true"
      />
      <div className={styles.imagePlaceholder} aria-hidden="true">
        {/* Use generate_image later for real preview */}
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className={styles.previewImage}
          />
        ) : (
          <span>PREVIEW</span>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.type}>{project.type}</span>
          <a
            href={project.link}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} project`}
          >
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.desc}>{project.description}</p>
        <div className={styles.tags} aria-label="Technologies used">
          {project.tech.map((tech) => (
            <span key={tech} className={styles.tag}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
