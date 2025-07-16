import type { SortControlProps } from './SortControl.types';
import styles from './SortControl.module.css';
import type { SortKey } from '@/types';

const SortControl = ({ onSortChange }: SortControlProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value as SortKey);
  };

  return (
    <div className={styles.formControl}>
      <label className={styles.label} htmlFor="sort-select">Sort By</label>
      <select
        id="sort-select"
        className={styles.select}
        defaultValue="stargazers_count"
        onChange={handleChange}
      >
        <option value="stargazers_count">Stars</option>
        <option value="language">Language</option>
      </select>
    </div>
  );
};

export default SortControl;
