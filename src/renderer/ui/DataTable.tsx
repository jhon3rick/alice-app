/**
 * DataTable
 *
 * Generic virtualized table component using MUI DataGrid.
 * Provides a reusable table with sorting, filtering, and actions.
 */

import React, { useMemo } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridActionsCellItem } from '@mui/x-data-grid';
import { Paper, useTheme } from '@mui/material';

import DataTableAction from './DataTableAction';
import DataTableFilter from './DataTableFilter';
import { useDataTableFilter } from '../hooks/useDataTableFilter';

import './DataTable.scss';

export interface DataTableProps<T extends { id: number | string }> {
  rows: T[];
  columns: GridColDef[];
  loading?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  disableRowSelectionOnClick?: boolean;
  autoHeight?: boolean;
  onRowClick?: (row: T) => void;
  checkboxSelection?: boolean;
  getRowId?: (row: T) => string | number;
  onEditRow?: (row: T) => void;
  onDeleteRow?: (row: T) => void;
  filterByFields?: string[];
}

function DataTable<T extends { id: number | string }>({
  rows,
  columns,
  loading = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  disableRowSelectionOnClick = true,
  autoHeight = true,
  onRowClick,
  checkboxSelection = false,
  getRowId,
  onEditRow,
  onDeleteRow,
  filterByFields,
}: DataTableProps<T>) {
  const theme = useTheme();

  const { filteredData, filterText, setFilterText } = useDataTableFilter({
    data: rows,
    filterByFields,
  });

  const columnsWithActions = useMemo<GridColDef[]>(() => {
    if (!onEditRow && !onDeleteRow) {
      return columns;
    }

    const actionsColumn: GridColDef = {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => {
        const actions = [];

        if (onEditRow) {
          actions.push(
            <DataTableAction
              key={`edit-${params.row.id}`}
              type="edit"
              row={params.row as T}
              onClick={onEditRow}
            />
          );
        }

        if (onDeleteRow) {
          actions.push(
            <DataTableAction
              key={`delete-${params.row.id}`}
              type="delete"
              row={params.row as T}
              onClick={onDeleteRow}
            />
          );
        }

        return actions;
      },
    };

    return [...columns, actionsColumn];
  }, [columns, onEditRow, onDeleteRow]);

  return (
    <Paper
      className="data-table"
      sx={{
        '& .MuiDataGrid-row:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      {filterByFields && filterByFields.length > 0 && (
        <DataTableFilter
          filterText={filterText}
          onFilterChange={setFilterText}
        />
      )}
      <DataGrid
        rows={filteredData as GridRowsProp}
        columns={columnsWithActions}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { pageSize, page: 0 },
          },
        }}
        pageSizeOptions={pageSizeOptions}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        autoHeight={autoHeight}
        onRowClick={(params) => onRowClick?.(params.row as T)}
        checkboxSelection={checkboxSelection}
        getRowId={getRowId}
      />
    </Paper>
  );
}

export default DataTable;
export { GridActionsCellItem };
export type { GridColDef };
