/**
 * DataTableAction
 *
 * Generic action button component for DataTable rows.
 * Renders a single action (edit or delete) based on props.
 */

import React from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

export interface DataTableActionProps<T> {
  type: 'edit' | 'delete';
  row: T;
  onClick?: (row: T) => void;
}

const ACTION_CONFIG = {
  edit: {
    icon: <Tooltip title="Edit row" arrow><Edit /></Tooltip>,
    label: 'Edit',
    color: 'primary' as const,
  },
  delete: {
    icon: <Tooltip title="Delete row" arrow><Delete color="error" /></Tooltip>,
    label: 'Delete',
    color: 'default' as const,
  },
};

function DataTableAction<T>({
  type,
  row,
  onClick,
}: DataTableActionProps<T>) {
  return (
    <GridActionsCellItem
      {...ACTION_CONFIG[type]}
      onClick={() => onClick(row)}
      showInMenu={false}
    />
  );
}

export default DataTableAction;
