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
    <article className={styles.container} data-testid={`repository-item-${repository.id}`}>
      <div className={styles.content} data-testid={`item-content-${repository.id}`}>
        <header className={styles.header} data-testid={`item-header-${repository.id}`}>
          <h3 className={styles.title}>
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.titleLink}
              data-testid={`repository-title-link-${repository.id}`}
            >
              {repository.name}
            </a>
          </h3>
          <StarButton
            isStarred={repository.isStarred}
            onClick={() => onToggleStar?.(repository)}
          />
        </header>

        <p className={styles.description} data-testid={`item-description-${repository.id}`}>
          {repository.description || 'No description available'}
        </p>

        <footer className={styles.metadata} data-testid={`item-metadata-${repository.id}`}>
          <div className={styles.metadataLeft} data-testid={`metadata-left-${repository.id}`}>
            {repository.language && (
              <LanguageChip language={repository.language} />
            )}
            <StarCount count={repository.stargazers_count} />
          </div>

          <div className={styles.metadataRight} data-testid={`metadata-right-${repository.id}`}>
            <span className={styles.owner} data-testid={`repository-owner-${repository.id}`}>
              by {repository.owner?.login || 'Unknown'}
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default ListItem;
