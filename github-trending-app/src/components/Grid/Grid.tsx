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
    <section>
      {repositories.length > 0 ? (
        <div className={styles.grid}>
          {repositories.map((repository) => (
            <div key={repository.id}>
              <Card
                repository={repository}
                onToggleStar={onToggleStar}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>
          {emptyMessage}
        </p>
      )}
    </section>
  );
};

export default Grid;
