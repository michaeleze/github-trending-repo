import styles from './LoadingState.module.css';

/**
 * Loading state component to display when content is loading
 */
const LoadingState = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <h2 className={styles.text}>
        Loading repositories...
      </h2>
    </div>
  );
};

export default LoadingState;