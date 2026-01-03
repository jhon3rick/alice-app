import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchProjects, addProject, modifyProject, removeProject } from '@store/projectsSlice';

// Custom Components
import ViewContainer from '@ui/ViewContainer';
import ModalNewProject from '@components/ModalNewProject';

// Types
import { Project } from '@tstypes/dbmodules';

const ProjectList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { projects } = useAppSelector((state) => state.projects);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleOpenDialog = (project?: Project) => {
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
          id: editingProject.id!,
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Path</TableCell>
              <TableCell>Code Index</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary">No projects found. Add one to get started.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.path || '-'}</TableCell>
                  <TableCell>{project.codeindex || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenDialog(project)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(project.id!)} color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalNewProject
        open={dialogOpen}
        editingProject={editingProject}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
    </ViewContainer>
  );
};

export default ProjectList;
