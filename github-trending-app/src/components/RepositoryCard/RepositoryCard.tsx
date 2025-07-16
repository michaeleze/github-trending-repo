import styles from './RepositoryCard.module.css';
import StarButton from '../ui/StarButton';
import LanguageChip from '../ui/LanguageChip';
import StarCount from '../ui/StarCount';
import type {RepositoryCardProps } from './RepositoryCard.types';
import type { Repository } from '@/types';

/**
 * Repository card component to display repository information
 */
const RepositoryCard = ({ repository, onToggleStar }: RepositoryCardProps) => {
  const { full_name, html_url } = repository as Repository;
  const { description, stargazers_count, language, isStarred } = repository;

  return (
    <article className={styles.card}>
      <div className={styles.cardContent}>
        <h2 className={styles.title}>
          <a
            className={styles.link}
            href={html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {full_name}
          </a>
        </h2>

        <p className={styles.description}>
          {description || 'No description available'}
        </p>

        <div className={styles.metaContainer}>
          { language && <LanguageChip language={language} />}
          { stargazers_count && stargazers_count > 0 && <StarCount count={stargazers_count} />}
        </div>
      </div>

      <div className={styles.cardActions}>
        <StarButton
          isStarred={isStarred || false}
          onClick={() => onToggleStar(repository)}
        />
      </div>
    </article>
  );
};

export default RepositoryCard;
