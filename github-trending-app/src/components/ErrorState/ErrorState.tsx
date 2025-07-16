import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        ⚠️
      </div>
      <div className={styles.message}>
        {message}
      </div>

      {onRetry && (
        <button
          className={styles.button}
          onClick={onRetry}
        >
          <span>↻</span> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
