import styles from './Noise.module.css';

export default function Noise() {
  return (
    <div className={styles.noiseWrapper}>
      <svg className={styles.noiseSvg}>
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
