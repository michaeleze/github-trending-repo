import styles from './StarButton.module.css';

export interface StarButtonProps {
  isStarred?: boolean;
  onClick: () => void;
}

const StarButton = ({ isStarred, onClick }: StarButtonProps) => {
  return (
    <button
      className={styles.starButton}
      onClick={onClick}
      type="button"
      aria-label={isStarred ? 'unstar' : 'star'}
    >
      <span className={styles.tooltip}>
        {isStarred ? 'Remove from starred' : 'Add to starred'}
      </span>
      {isStarred ? (
        <span className={styles.starIcon}>★</span>
      ) : (
        <span className={styles.starBorderIcon}>☆</span>
      )}
    </button>
  );
};

export default StarButton;
