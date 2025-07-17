import styles from './LanguageChip.module.css';

interface LanguageChipProps {
  language: string | null;
}

const LanguageChip = ({ language }: LanguageChipProps) => {
  const languageSlug = language?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'unknown';
  return (
    <span className={styles.languageChip} data-testid={`language-chip-${languageSlug}`}>
      <span className={styles.codeIcon} aria-hidden="true" data-testid={`language-icon-${languageSlug}`}>⌨️</span>
      <span className={styles.label} data-testid={`language-label-${languageSlug}`}>{language}</span>
    </span>
  );
};

export default LanguageChip;
