import TabLayout from '@/components/TabLayout';
import RepositoryGrid from '@/components/RepositoryGrid';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { use } from 'react';
import { RepositoriesContext } from '@/context';

const RepositoriesPage = () => {
  const {
    allRepositories,
    starredRepositories,
    loading,
    error,
    toggleStar,
    sortRepositories
  } = use(RepositoriesContext);

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
      label: 'All Repositories',
      content: (
        <RepositoryGrid
          repositories={allRepositories}
          onToggleStar={toggleStar}
          onSort={sortRepositories}
          emptyMessage="No trending repositories found."
        />
      ),
    },
    {
      label: 'Starred Repositories',
      content: (
        <RepositoryGrid
          repositories={starredRepositories}
          onToggleStar={toggleStar}
          onSort={sortRepositories}
          emptyMessage="You haven't starred any repositories yet."
        />
      ),
    },
  ];

  return (
    <TabLayout
      title="GitHub Trending Repositories"
      tabs={tabs}
    />
  );
};

export default RepositoriesPage;
