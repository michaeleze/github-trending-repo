import styles from './StarButton.module.css';

export interface StarButtonProps {
  isStarred?: boolean;
  onClick: () => void;
}

const StarButton = ({ isStarred, onClick }: StarButtonProps) => {
  const starState = isStarred ? 'starred' : 'unstarred';
  return (
    <button
      className={styles.starButton}
      onClick={onClick}
      type="button"
      aria-label={isStarred ? 'unstar' : 'star'}
      data-testid={`star-button-${starState}`}
    >
      <span className={styles.tooltip} data-testid={`star-tooltip-${starState}`}>
        {isStarred ? 'Remove from starred' : 'Add to starred'}
      </span>
      {isStarred ? (
        <span className={styles.starIcon} data-testid="star-icon-filled">★</span>
      ) : (
        <span className={styles.starBorderIcon} data-testid="star-icon-empty">☆</span>
      )}
    </button>
  );
};

export default StarButton;
