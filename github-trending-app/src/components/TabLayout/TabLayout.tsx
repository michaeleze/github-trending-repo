import { useState } from 'react';
import type { TabPanelProps, TabLayoutProps } from './TabLayout.types';
import styles from './TabLayout.module.css';

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      className={value === index ? styles.tabPanel : styles.tabPanelHidden}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

/**
 * Tab layout template component for organizing content in tabs
 */
const TabLayout = ({ title, tabs }: TabLayoutProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {title}
      </h1>

      <div className={styles.paper}>
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
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
        </div>

        {tabs.map((tab, index) => (
          <TabPanel key={index} value={value} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </div>
    </div>
  );
};

export default TabLayout;
