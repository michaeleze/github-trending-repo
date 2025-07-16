export interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  isStarred?: boolean;
}

export type RepositoryEssentials = Pick<Repository, 'id' | 'full_name' | 'html_url'>;

export type SortableRepositoryFields = Pick<Repository, 'language' | 'stargazers_count'>;

export type StarrableRepository = Repository & { isStarred: boolean };

export interface RepositoriesState {
  allRepositories: Repository[];
  starredRepositories: Repository[];
}

export type SortKey = keyof SortableRepositoryFields;
