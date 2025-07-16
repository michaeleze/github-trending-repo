import type { StarCountProps } from '@/types/component.type';
import styles from './StarCount.module.css';

/**
 * Star count component to display repository star count
 * Atomic component that follows the Single Responsibility Principle
 */
const StarCount = ({ count }: StarCountProps) => {
  // Format large numbers with k suffix (e.g., 1.5k)
  const formatStarCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className={styles.starCount}>
      <span className={styles.starIcon}>★</span>
      <span className={styles.label}>{formatStarCount(count)}</span>
    </div>
  );
};

export default StarCount;
