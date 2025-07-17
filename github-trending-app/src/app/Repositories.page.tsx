import TabLayout from '@/components/TabLayout';
import List from '@/components/List';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { use, useState, useMemo } from 'react';
import { RepositoriesContext } from '@/context/app';
import { getFilteredRepositories } from '@/utils';
import { LABELS, PAGE_TITLE } from '@/constants';
import type { Repository } from '@/types';

const RepositoriesPage = () => {
  const {
    allRepositories,
    starredRepositories,
    loading,
    error,
    toggleStar,
  } = use(RepositoriesContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  // Get languages for filter options
  const availableLanguages = useMemo(() => allRepositories.filter(repo => repo.language !== null).map(repo => repo.language),
    [allRepositories]
  );

  // Filter and search repositories
  const filteredAllRepositories = useMemo(() =>
    getFilteredRepositories(allRepositories, { searchTerm, languageFilter }),
    [allRepositories, searchTerm, languageFilter]
  );

  const filteredStarredRepositories = useMemo(() =>
    getFilteredRepositories(starredRepositories, { searchTerm, languageFilter }),
    [starredRepositories, searchTerm, languageFilter]
  );

  const handleToggleStarredRepositories = (repo: Repository) => {
    const repository = starredRepositories.find(item => item.id === repo.id);
    if (repository) {
      toggleStar?.(repository);
    }
  };

  const handleToggleRepositories = (repo: Repository) => {
    const repository = allRepositories.find(item => item.id === repo.id);
    if (repository) {
      toggleStar?.(repository);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleLanguageFilter = (language: string) => {
    setLanguageFilter(language);
  };

  // If loading, show loading state
  if (loading) {
    return <LoadingState />;
  }

  // If error, show error state
  if (error) {
    return <ErrorState message={error} />;
  }

  // Define tabs for the tab layout
  const tabs = [
    {
      label: LABELS.all,
      content: (
        <List
          repositories={filteredAllRepositories}
          onToggleStar={handleToggleRepositories}
          emptyMessage="No trending repositories found."
        />
      ),
    },
    {
      label:LABELS.starred,
      content: (
        <List
          repositories={filteredStarredRepositories}
          onToggleStar={handleToggleStarredRepositories}
          emptyMessage="You haven't starred any repositories yet."
        />
      ),
    },
  ];

  return (
    <TabLayout
      title={PAGE_TITLE}
      tabs={tabs}
      onSearch={handleSearch}
      onLanguageFilter={handleLanguageFilter}
      availableLanguages={availableLanguages as string[]}
    />
  );
};

export default RepositoriesPage;
