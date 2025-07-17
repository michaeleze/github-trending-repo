import styles from './StarCount.module.css';
import { formatStarCount } from '@/utils/formatters';
interface StarCountProps {
  count: number;
}

const StarCount = ({ count }: StarCountProps) => {
  return (
    <span className={styles.starCount}>
      <span className={styles.starIcon} aria-hidden="true">★</span>
      <span className={styles.count} aria-label={`${count} stars`}>{formatStarCount(count)}</span>
    </span>
  );
};

export default StarCount;
