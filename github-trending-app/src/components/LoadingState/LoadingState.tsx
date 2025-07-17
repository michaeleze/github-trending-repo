import styles from './LoadingState.module.css';

/**
 * Loading state component to display when content is loading
 */
const LoadingState = () => {
  return (
    <section className={styles.container} aria-label="Loading state">
      <div className={styles.spinner} role="progressbar" aria-label="Loading" />
      <h2 className={styles.text}>
        Loading repositories...
      </h2>
    </section>
  );
};

export default LoadingState;