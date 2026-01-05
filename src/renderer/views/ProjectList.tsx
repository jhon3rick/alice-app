/**
 * ProjectList
 *
 * View component for listing and managing projects.
 * Displays projects in a table with add, edit, and delete functionality.
 */

import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchProjects, addProject, modifyProject, removeProject } from '@store/projectsSlice';

// Custom Components
import ViewContainer from '@ui/ViewContainer';
import DataTable, { GridColDef } from '@ui/DataTable';
import ModalNewProject from '@components/ModalNewProject';

// Types
import { StoredProject } from '@tstypes/dbmodules';

const columnsSchema: GridColDef[] = [
  {
    flex: 1,
    field: 'codeindex',
    headerName: 'Code Index',
    minWidth: 50,
    valueGetter: (value) => value || '-',
  },
  {
    flex: 1,
    field: 'name',
    headerName: 'Name',
    minWidth: 150,
  },
  {
    flex: 1,
    field: 'path',
    headerName: 'Path',
    minWidth: 150,
  },
];

const ProjectList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { projects } = useAppSelector((state) => state.projects) as { projects: StoredProject[] };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<StoredProject | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleOpenDialog = (project?: StoredProject) => {
    setEditingProject(project || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProject(null);
  };

  const handleSave = async (formData: { name: string; path?: string; codeindex?: string }) => {
    if (editingProject) {
      await dispatch(
        modifyProject({
          id: editingProject.id,
          name: formData.name,
          path: formData.path,
          codeindex: formData.codeindex,
        })
      );
    } else {
      await dispatch(
        addProject({
          name: formData.name,
          path: formData.path,
          codeindex: formData.codeindex,
        })
      );
    }

    handleCloseDialog();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await dispatch(removeProject(id));
    }
  };

  return (
    <ViewContainer
      title="projects"
      actions={
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Project
        </Button>
      }
    >
      <DataTable
        rows={projects}
        columns={columnsSchema}
        pageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      <ModalNewProject open={dialogOpen} editingProject={editingProject} onClose={handleCloseDialog} onSave={handleSave} />
    </ViewContainer>
  );
};

export default ProjectList;
