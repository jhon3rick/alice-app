/**
 * DataTable
 *
 * Generic virtualized table component using MUI DataGrid.
 * Provides a reusable table with sorting, filtering, and actions.
 */

import React, { useMemo } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridActionsCellItem } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

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
  onDeleteRow?: (id: number | string) => void;
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
}: DataTableProps<T>) {
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
          actions.push(<GridActionsCellItem icon={<Edit />} label="Edit" color="primary" onClick={() => onEditRow(params.row as T)} tooltip="Edit" />);
        }
        if (onDeleteRow) {
          actions.push(
            <GridActionsCellItem icon={<Delete />} label="Delete" color="error" onClick={() => onDeleteRow(params.row.id)} showInMenu={false} tooltip="Delete" />
          );
        }
        return actions;
      },
    };

    return [...columns, actionsColumn];
  }, [columns, onEditRow, onDeleteRow]);

  return (
    <Paper className={`data-table ${onRowClick ? 'clickable' : ''}`}>
      <DataGrid
        rows={rows as GridRowsProp}
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
