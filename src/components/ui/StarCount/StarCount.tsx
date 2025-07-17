import styles from './StarCount.module.css';
import { formatStarCount } from '@/utils/helper';
interface StarCountProps {
  count: number;
}

const StarCount = ({ count }: StarCountProps) => {
  return (
    <span className={styles.starCount} data-testid={`star-count-${count}`}>
      <span className={styles.starIcon} aria-hidden="true" data-testid={`star-count-icon-${count}`}>★</span>
      <span className={styles.count} aria-label={`${count} stars`} data-testid={`star-count-value-${count}`}>{formatStarCount(count)}</span>
    </span>
  );
};

export default StarCount;
