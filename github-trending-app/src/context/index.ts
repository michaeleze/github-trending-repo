import type { PartialRepositoriesContext, RepositoriesContextType, RepositoriesState } from "@/types";
import { createContext } from "react";

// Create default context value using PartialRepositoriesContext
const initialState: RepositoriesState = {
  allRepositories: [],
  starredRepositories: []
};

const defaultContextValue: PartialRepositoriesContext = {
  ...initialState,
  loading: false,
  error: null,
  toggleStar: () => {},
  sortRepositories: () => {}
};

export const RepositoriesContext = createContext<RepositoriesContextType>(defaultContextValue as RepositoriesContextType);
