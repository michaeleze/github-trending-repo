import styles from './List.module.css';
import ListItem from '../ListItem';
import type { Repository, RepositoryActions } from '@/types';

interface ListProps {
  repositories: Repository[];
  emptyMessage?: string;
  onToggleStar?: RepositoryActions['toggleStar'];
}

const List = ({
  repositories,
  onToggleStar,
  emptyMessage = 'No repositories found.'
}: ListProps) => {
  if (repositories.length === 0) {
    return (
      <section className={styles.emptyState} aria-label="Empty state">
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className={styles.container} aria-label="Repository list">
      <ul className={styles.list}>
        {repositories.map((repository) => (
          <li key={`repository-${repository.id}`} className={styles.listItem}>
            <ListItem
              repository={repository}
              onToggleStar={onToggleStar}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default List;
