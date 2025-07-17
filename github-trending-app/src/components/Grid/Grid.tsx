import styles from './Grid.module.css';
import Card from '../Card';
import type { GridProps } from './Grid.types';

/**
 * Grid component to display a grid of cards
 * Organism component that combines multiple molecules
 */
const Grid = ({
  repositories,
  onToggleStar,
  emptyMessage = 'No repositories found.'
}: GridProps) => {
  return (
    <section aria-label="Repository grid">
      {repositories.length > 0 ? (
        <ul className={styles.grid}>
          {repositories.map((repository) => (
            <li key={repository.id} className={styles.gridItem}>
              <Card
                repository={repository}
                onToggleStar={onToggleStar}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>
          {emptyMessage}
        </p>
      )}
    </section>
  );
};

export default Grid;
