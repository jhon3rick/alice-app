/**
 * CommandList
 *
 * View component for listing and filtering commands.
 * Displays commands in virtualized table with expandable rows.
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCommands, setFilters, deleteCommand } from '@store/commandsSlice';

// Custom Components
import ViewContainer from '@ui/ViewContainer';
import ActionsToolbar from '@ui/ActionsToolbar';
import SelectProject from '@components/SelectProject';
import SelectTags from '@components/SelectTags';
import CommandsTable from '@components/CommandsTable';

import './CommandList.scss';

const CommandList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { commands, loading } = useAppSelector((state) => state.commands);
  const { tags } = useAppSelector((state) => state.tags);

  const [selectedProject, setSelectedProject] = useState<number | ''>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchCommands(undefined));
  }, [dispatch]);

  // Memoize tagIds calculation to avoid recalculating on every render
  const tagIds = useMemo(() => {
    return selectedTags
      .map((tagName) => tags.find((t) => t.name === tagName)?.id)
      .filter((id): id is number => id !== undefined);
  }, [selectedTags, tags]);

  useEffect(() => {
    dispatch(
      setFilters({
        projectId: selectedProject || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
      })
    );

    dispatch(
      fetchCommands({
        projectId: selectedProject || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
      })
    );
  }, [selectedProject, tagIds, dispatch]);

  const handleEdit = useCallback(
    (command: Command) => {
      navigate(`/commands/${command.id}/edit`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (window.confirm('Are you sure you want to delete this command?')) {
        await dispatch(deleteCommand(id));
      }
    },
    [dispatch]
  );

  const handleViewDetail = useCallback(
    (id: number) => {
      navigate(`/commands/${id}`);
    },
    [navigate]
  );

  return (
    <ViewContainer title="commands">
      <ActionsToolbar actions={[{ iconName: 'add', tooltip: 'Add Command', onClick: () => navigate('/commands/new') }]} />
      <Box className="command-list__filters">
        <SelectProject value={selectedProject} onChange={setSelectedProject} />
        <SelectTags value={selectedTags} onChange={setSelectedTags} />
      </Box>

      <Box sx={{ mt: 2 }}>
        <CommandsTable commands={commands} loading={loading} onEdit={handleEdit} onDelete={handleDelete} onViewDetail={handleViewDetail} />
      </Box>
    </ViewContainer>
  );
};

export default CommandList;
