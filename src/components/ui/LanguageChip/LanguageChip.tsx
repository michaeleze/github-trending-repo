import styles from './LanguageChip.module.css';

interface LanguageChipProps {
  language: string | null;
}

const LanguageChip = ({ language }: LanguageChipProps) => {
  return (
    <span className={styles.languageChip}>
      <span className={styles.codeIcon} aria-hidden="true">⌨️</span>
      <span className={styles.label}>{language}</span>
    </span>
  );
};

export default LanguageChip;
