import type { ReactNode } from 'react';

export interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export interface TabLayoutProps {
  title: string;
  tabs: {
    label: string;
    content: ReactNode;
  }[];
  onSearch?: (searchTerm: string) => void;
  onLanguageFilter?: (language: string) => void;
  availableLanguages?: string[];
}
