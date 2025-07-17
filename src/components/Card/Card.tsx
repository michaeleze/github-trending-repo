import styles from './Card.module.css';
import StarButton from '../ui/StarButton';
import LanguageChip from '../ui/LanguageChip';
import type { Repository } from '@/types';
import StarCount from '../ui/StarCount/StarCount';

export interface CardProps {
  repository: Repository;
  onToggleStar: (repository: Repository) => void;
}

const Card = ({ repository, onToggleStar }: CardProps) => {
  const { full_name, html_url } = repository as Repository;
  const { description, stargazers_count, language, isStarred } = repository;

  return (
    <article className={styles.card} data-testid={`repository-card-${repository.id}`}>
      <div className={styles.cardContent} data-testid={`card-content-${repository.id}`}>
        <header data-testid={`card-header-${repository.id}`}>
          <h2 className={styles.title}>
            <a
              className={styles.link}
              href={html_url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`repository-link-${repository.id}`}
            >
              {full_name}
            </a>
          </h2>
        </header>

        <p className={styles.description} data-testid={`repository-description-${repository.id}`}>
          {description || 'No description available'}
        </p>

        <footer className={styles.metaContainer} data-testid={`card-metadata-${repository.id}`}>
          { language && <LanguageChip language={language} />}
          { stargazers_count && stargazers_count > 0 && <StarCount count={stargazers_count} />}
        </footer>
      </div>

      <aside className={styles.cardActions} data-testid={`card-actions-${repository.id}`}>
        <StarButton
          isStarred={isStarred || false}
          onClick={() => onToggleStar(repository)}
        />
      </aside>
    </article>
  );
};

export default Card;
