import type { SortKey } from '@/types';

export interface SortControlProps {
  onSortChange: (key: SortKey) => void;
}

export interface SortableProps {
  onSort: (key: SortKey) => void;
}
