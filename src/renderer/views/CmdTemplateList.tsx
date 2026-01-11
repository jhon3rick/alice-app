/**
 * CmdTemplateList
 *
 * View component for listing and filtering commands.
 * Displays commands in virtualized table with expandable rows.
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCommandTemplates, setFilters, removeCommandTemplate } from '@store/commandTemplatesSlice';

// Types
import type { CommandTemplate } from '@tstypes/dbmodules';

// Custom Components
import ViewContainer from '@ui/ViewContainer';
import ActionsToolbar from '@ui/ActionsToolbar';
import SelectProject from '@components/SelectProject';
import SelectTags from '@components/SelectTags';
import CmdTemplatesTable from '@components/CmdTemplatesTable';

import './CmdTemplateList.scss';

const CmdTemplateList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { commands, loading } = useAppSelector((state) => state.commandTemplates);
  const { tags } = useAppSelector((state) => state.tags);

  const [selectedProject, setSelectedProject] = useState<number | ''>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchCommandTemplates(undefined));
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
      fetchCommandTemplates({
        projectId: selectedProject || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
      })
    );
  }, [selectedProject, tagIds, dispatch]);

  const handleEdit = useCallback(
    (command: CommandTemplate) => {
      navigate(`/cmd-templates/${command.id}/edit`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (window.confirm('Are you sure you want to delete this command?')) {
        await dispatch(removeCommandTemplate(id));
      }
    },
    [dispatch]
  );

  const handleViewDetail = useCallback(
    (id: number) => {
      navigate(`/cmd-templates/${id}`);
    },
    [navigate]
  );

  return (
    <ViewContainer title="commands">
      <ActionsToolbar actions={[{ iconName: 'add', tooltip: 'Add Command', onClick: () => navigate('/cmd-templates/new') }]} />
      <Box className="cmd-template-list__filters">
        <SelectProject value={selectedProject} onChange={setSelectedProject} />
        <SelectTags value={selectedTags} onChange={setSelectedTags} />
      </Box>

      <Box sx={{ mt: 2 }}>
        <CmdTemplatesTable commands={commands} loading={loading} onEdit={handleEdit} onDelete={handleDelete} onViewDetail={handleViewDetail} />
      </Box>
    </ViewContainer>
  );
};

export default CmdTemplateList;
