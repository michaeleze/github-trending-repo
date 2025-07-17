import { useState } from 'react';
import styles from './SearchAndFilter.module.css';

interface SearchAndFilterProps {
  onSearch?: (searchTerm: string) => void;
  onLanguageFilter?: (language: string) => void;
  availableLanguages?: string[];
  placeholder?: string;
}

const SearchAndFilter = ({ onSearch, onLanguageFilter, availableLanguages = [], placeholder = "Search" }: SearchAndFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleLanguageFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLanguageFilter(value);
    onLanguageFilter?.(value);
  };

  return (
    <form className={styles.container} onSubmit={(e) => e.preventDefault()} data-testid="search-and-filter-form">
      <fieldset className={styles.searchContainer} data-testid="search-fieldset">
        <legend className={styles.visuallyHidden}>Search Repositories</legend>
        <label htmlFor="repository-search" className={styles.visuallyHidden}>Search repositories</label>
        <div className={styles.searchInputWrapper} data-testid="search-input-wrapper">
          <svg
            className={styles.searchIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            data-testid="search-icon"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            id="repository-search"
            type="search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
            aria-label="Search repositories"
            data-testid="search-input"
          />
        </div>
      </fieldset>

      <fieldset className={styles.filterContainer} data-testid="filter-fieldset">
        <legend className={styles.visuallyHidden}>Filter by language</legend>
        <label htmlFor="language-filter" className={styles.visuallyHidden}>Filter by language</label>
        <select
          id="language-filter"
          value={languageFilter}
          onChange={handleLanguageFilterChange}
          className={styles.filterSelect}
          aria-label="Filter repositories by programming language"
          data-testid="language-filter-select"
        >
          <option value="" data-testid="all-languages-option">All Languages</option>
          {availableLanguages.map(language => (
            <option key={language} value={language} data-testid={`language-option-${language.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>{language}</option>
          ))}
        </select>
        <svg
          className={styles.filterIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          data-testid="filter-dropdown-icon"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </fieldset>
    </form>
  );
};

export default SearchAndFilter;
