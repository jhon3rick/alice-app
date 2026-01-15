/**
 * DataTableEmpty
 *
 * Empty state component for DataTable when no data is available.
 */

import React from 'react';
import { useTheme } from '@mui/material';
import EmptyTableSvg from '@assets/svg/EmptyTableThemed.svg';
import './DataTableEmpty.scss';

const DataTableEmpty: React.FC = () => {
  const theme = useTheme();

  return (
    <div
      className="data-table-empty"
      style={{ '--theme-primary-color': theme.palette.primary.main } as React.CSSProperties}
    >
      <div
        className="data-table-empty__icon"
        dangerouslySetInnerHTML={{ __html: EmptyTableSvg }}
      />
      <h6 className="data-table-empty__title">No data available</h6>
      <p className="data-table-empty__description">There are no records to display</p>
    </div>
  );
};

export default DataTableEmpty;
