import styles from './ListItem.module.css';
import StarButton from '../ui/StarButton';
import LanguageChip from '../ui/LanguageChip';
import StarCount from '../ui/StarCount/StarCount';
import type { Repository, RepositoryActions } from '@/types';

interface ListItemProps {
  repository: Repository;
  onToggleStar?: RepositoryActions['toggleStar'];
}

const ListItem = ({ repository, onToggleStar }: ListItemProps) => {
  return (
    <article className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h3 className={styles.title}>
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.titleLink}
            >
              {repository.name}
            </a>
          </h3>
          <StarButton
            isStarred={repository.isStarred}
            onClick={() => onToggleStar?.(repository)}
          />
        </header>

        <p className={styles.description}>
          {repository.description || 'No description available'}
        </p>

        <footer className={styles.metadata}>
          <div className={styles.metadataLeft}>
            {repository.language && (
              <LanguageChip language={repository.language} />
            )}
            <StarCount count={repository.stargazers_count} />
          </div>

          <div className={styles.metadataRight}>
            <span className={styles.owner}>
              by {repository.owner?.login || 'Unknown'}
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default ListItem;
