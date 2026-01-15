/**
 * DataTableFilter
 *
 * Filter component for DataTable with search functionality.
 * Supports wildcard searches using % character.
 */

import React from 'react';
import { Box, TextField, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import './DataTableFilter.scss';

export interface DataTableFilterProps {
  filterText: string;
  onFilterChange: (value: string) => void;
  placeholder?: string;
}

function DataTableFilter({
  filterText,
  onFilterChange,
  placeholder = "Search (use % for wildcards)",
}: DataTableFilterProps) {
  const theme = useTheme();

  return (
    <Box
      className="data-table-filter"
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      <Box
        className="data-table-filter__container"
        sx={{
          backgroundImage: 'var(--Paper-overlay)',
          backgroundColor: theme.palette.background.paper,
          border: '1px solid ' + theme.palette.divider,
        }}
      >
        <TextField
          className="data-table-filter__input"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.background.paper,
            }
          }}
          size="small"
          placeholder={placeholder}
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
      </Box>
    </Box>
  );
}

export default DataTableFilter;
