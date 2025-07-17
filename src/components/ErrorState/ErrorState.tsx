import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  const hasRetry = onRetry ? 'with-retry' : 'no-retry';
  return (
    <section className={styles.container} aria-label="Error state" role="alert" data-testid={`error-state-${hasRetry}`}>
      <div className={styles.icon} aria-hidden="true" data-testid={`error-icon-${hasRetry}`}>
        ⚠️
      </div>
      <p className={styles.message} data-testid={`error-message-${hasRetry}`}>
        {message}
      </p>

      {onRetry && (
        <button
          className={styles.button}
          onClick={onRetry}
          type="button"
          data-testid="retry-button"
        >
          <span aria-hidden="true">↻</span> Retry
        </button>
      )}
    </section>
  );
};

export default ErrorState;
