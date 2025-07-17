import { useState } from 'react';
import SearchAndFilter from '../SearchAndFilter';
import type { TabPanelProps, TabLayoutProps } from './TabLayout.types';
import styles from './TabLayout.module.css';

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <section
      role="tabpanel"
      className={value === index ? styles.tabPanel : styles.tabPanelHidden}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && children}
    </section>
  );
};

/**
 * Tab layout template component for organizing content in tabs
 */
const TabLayout = ({ title, tabs, onSearch, onLanguageFilter, availableLanguages }: TabLayoutProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {title}
        </h1>
      </header>

      <article className={styles.paper}>
        <nav className={styles.tabsContainer} aria-label="Repository tabs">
          <div className={styles.tabs} role="tablist">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`${styles.tab} ${value === index ? styles.tabActive : ''}`}
                onClick={(e) => handleChange(e, index)}
                id={`tab-${index}`}
                aria-controls={`tabpanel-${index}`}
                role="tab"
                aria-selected={value === index}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <section className={styles.searchSection} aria-label="Search and filter">
          <SearchAndFilter
            onSearch={onSearch}
            onLanguageFilter={onLanguageFilter}
            availableLanguages={availableLanguages}
            placeholder="Search repositories..."
          />
        </section>

        {tabs.map((tab, index) => (
          <TabPanel key={index} value={value} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </article>
    </main>
  );
};

export default TabLayout;
