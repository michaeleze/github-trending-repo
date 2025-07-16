import styles from './LanguageChip.module.css';

interface LanguageChipProps {
  language: string | null;
}

const LanguageChip = ({ language }: LanguageChipProps) => {
  return (
    <div className={styles.languageChip}>
      <span className={styles.codeIcon}>⌨️</span>
      <span className={styles.label}>{language}</span>
    </div>
  );
};

export default LanguageChip;
