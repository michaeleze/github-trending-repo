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
    <section aria-label="Repository grid" data-testid="repository-grid">
      {repositories.length > 0 ? (
        <ul className={styles.grid} data-testid="repositories-grid">
          {repositories.map((repository) => (
            <li key={repository.id} className={styles.gridItem} data-testid={`grid-item-${repository.id}`}>
              <Card
                repository={repository}
                onToggleStar={onToggleStar}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage} data-testid="grid-empty-message">
          {emptyMessage}
        </p>
      )}
    </section>
  );
};

export default Grid;
