import styles from './RepositoryGrid.module.css';
import RepositoryCard from '../RepositoryCard/RepositoryCard';
import SortControl from '../SortControl/SortControl';
import type { RepositoryGridProps } from './RepositoryGrid.types';

/**
 * Repository grid component to display a grid of repository cards
 * Organism component that combines multiple molecules
 */
const RepositoryGrid = ({
  repositories,
  onToggleStar,
  onSort,
  emptyMessage = 'No repositories found.'
}: RepositoryGridProps) => {
  return (
    <section>
      <div className={styles.sortControlContainer}>
        <SortControl onSortChange={onSort} />
      </div>

      {repositories.length > 0 ? (
        <div className={styles.grid}>
          {repositories.map((repository) => (
            <div key={repository.id}>
              <RepositoryCard
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

export default RepositoryGrid;
