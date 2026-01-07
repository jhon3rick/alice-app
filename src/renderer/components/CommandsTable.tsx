/**
 * CommandsTable
 *
 * Expandable table component for displaying commands.
 * Each row can be expanded to show command details and steps.
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Collapse,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Edit, Delete, Terminal } from '@mui/icons-material';
import type { Command } from '@tstypes/dbmodules';
import CommandRowDetail from './CommandRowDetail';

import './CommandsTable.scss';

interface CommandsTableProps {
  commands: Command[];
  loading?: boolean;
  onEdit: (command: Command) => void;
  onDelete: (id: number) => void;
  onViewDetail?: (id: number) => void;
}

const CommandsTable: React.FC<CommandsTableProps> = ({ commands, loading = false, onEdit, onDelete, onViewDetail }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const paginatedCommands = commands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <div className="commands-table__loading">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Paper className="commands-table">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="commands-table__header-expand-cell" />
              <TableCell>Command</TableCell>
              <TableCell className="commands-table__header-tags-cell">Tags</TableCell>
              <TableCell className="commands-table__header-actions-cell" align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCommands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" className="commands-table__empty-cell">
                  <Typography color="text.secondary">No commands found. Create one to get started.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCommands.map((command) => {
                const isExpanded = expandedRows.has(command.id!);
                return (
                  <React.Fragment key={command.id}>
                    <TableRow
                      hover
                      onClick={() => toggleRowExpansion(command.id!)}
                      className={isExpanded ? 'commands-table__row-expanded' : ''}
                    >
                      <TableCell className="commands-table__cell-top-align">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleRowExpansion(command.id!); }}>
                          {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <div className="commands-table__command-info">
                          <span className="commands-table__command-name">
                            {command.name}
                          </span>
                          <span className="commands-table__command-resumen">
                            {command.resumen}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="commands-table__tags-container">
                          {command.tags?.map((tag) => (
                            <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell align="center" className="commands-table__cell-top-align">
                        <div className="commands-table__actions-container">
                          {onViewDetail && (
                            <IconButton
                              size="small"
                              color="default"
                              onClick={(e) => { e.stopPropagation(); onViewDetail(command.id!); }}
                            >
                              <Terminal fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => { e.stopPropagation(); onEdit(command); }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => { e.stopPropagation(); onDelete(command.id!); }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className={`commands-table__detail-row ${isExpanded ? 'commands-table__detail-row--expanded' : ''}`}>
                      <TableCell colSpan={4} className="commands-table__detail-cell">
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <CommandRowDetail command={command} />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={commands.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CommandsTable;
