import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <section className={styles.container} aria-label="Error state" role="alert">
      <div className={styles.icon} aria-hidden="true">
        ⚠️
      </div>
      <p className={styles.message}>
        {message}
      </p>

      {onRetry && (
        <button
          className={styles.button}
          onClick={onRetry}
          type="button"
        >
          <span aria-hidden="true">↻</span> Retry
        </button>
      )}
    </section>
  );
};

export default ErrorState;
