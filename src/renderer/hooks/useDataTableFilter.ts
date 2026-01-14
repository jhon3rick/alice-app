/**
 * useDataTableFilter
 *
 * Custom hook for filtering table data with wildcard support.
 * Supports % wildcards for advanced filtering patterns.
 */

import { useState, useMemo } from 'react';

export interface UseTableFilterOptions<T> {
  data: T[];
  filterByFields?: string[];
}

export interface UseTableFilterReturn<T> {
  filteredData: T[];
  filterText: string;
  setFilterText: (text: string) => void;
  clearFilter: () => void;
}

/**
 * Hook for filtering table data by multiple fields with wildcard support
 *
 * Wildcard patterns:
 * - %text: matches items ending with "text"
 * - text%: matches items starting with "text"
 * - %text%: matches items containing "text"
 * - text: matches items containing "text" (default behavior)
 *
 * @example
 * const { filteredData, filterText, setFilterText } = useDataTableFilter({
 *   data: users,
 *   filterByFields: ['name', 'email']
 * });
 */
export function useDataTableFilter<T>({
  data,
  filterByFields,
}: UseDataTableFilterOptions<T>): UseDataTableFilterReturn<T> {
  const [filterText, setFilterText] = useState('');

  const filteredData = useMemo(() => {
    if (!filterByFields || filterByFields.length === 0 || !filterText.trim()) {
      return data;
    }

    const searchText = filterText.trim();
    const startsWithWildcard = searchText.startsWith('%');
    const endsWithWildcard = searchText.endsWith('%');
    const cleanText = searchText.replace(/^%|%$/g, '').toLowerCase();

    return data.filter((row) => {
      return filterByFields.some((field) => {
        const value = String((row as Record<string, unknown>)[field] || '').toLowerCase();

        if (startsWithWildcard && endsWithWildcard) {
          return value.includes(cleanText);
        } else if (startsWithWildcard) {
          return value.endsWith(cleanText);
        } else if (endsWithWildcard) {
          return value.startsWith(cleanText);
        } else {
          return value.includes(cleanText);
        }
      });
    });
  }, [data, filterByFields, filterText]);

  const clearFilter = () => setFilterText('');

  return {
    filteredData,
    filterText,
    setFilterText,
    clearFilter,
  };
}
