import styles from './StarCount.module.css';
import { formatStarCount } from '@/utils/formatters';
interface StarCountProps {
  count: number;
}

const StarCount = ({ count }: StarCountProps) => {
  return (
    <div className={styles.starCount}>
      <span className={styles.starIcon}>★</span>
      <span className={styles.count}>{formatStarCount(count)}</span>
    </div>
  );
};

export default StarCount;
