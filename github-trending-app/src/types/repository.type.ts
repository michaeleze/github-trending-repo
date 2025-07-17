export interface Repository {
  id: number;
  name: string;
  full_name: string;
   owner: {
    login: string;
  };
  created_at: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  isStarred?: boolean | undefined;
}

export type RepositoryEssentials = Pick<Repository, 'id' | 'full_name' | 'html_url'>;

export type StarrableRepository = Repository & { isStarred: boolean };

export interface RepositoriesState {
  allRepositories: Repository[];
  starredRepositories: Repository[];
}
