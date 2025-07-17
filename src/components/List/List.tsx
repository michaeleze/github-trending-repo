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
      <section className={styles.emptyState} aria-label="Empty state" data-testid="empty-state">
        <p className={styles.emptyMessage} data-testid="empty-message">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className={styles.container} aria-label="Repository list" data-testid="repository-list">
      <ul className={styles.list} data-testid="repositories-list">
        {repositories.map((repository) => (
          <li key={`repository-${repository.id}`} className={styles.listItem} data-testid={`list-item-${repository.id}`}>
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
