import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import ViewContainer from '@ui/ViewContainer';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchProjects, addProject, modifyProject, removeProject } from '@store/projectsSlice';
import { Project } from '@types/index';

const ProjectList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { projects } = useAppSelector((state) => state.projects);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: '', path: '', codeindex: '' });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        path: project.path || '',
        codeindex: project.codeindex || '',
      });
    } else {
      setEditingProject(null);
      setFormData({ name: '', path: '', codeindex: '' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProject(null);
    setFormData({ name: '', path: '', codeindex: '' });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    if (editingProject) {
      await dispatch(
        modifyProject({
          id: editingProject.id!,
          name: formData.name,
          path: formData.path || undefined,
          codeindex: formData.codeindex || undefined,
        })
      );
    } else {
      await dispatch(
        addProject({
          name: formData.name,
          path: formData.path || undefined,
          codeindex: formData.codeindex || undefined,
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Project Path"
            fullWidth
            value={formData.path}
            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
            helperText="Optional: Specific directory path for command execution"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Code Index"
            fullWidth
            value={formData.codeindex}
            onChange={(e) => setFormData({ ...formData, codeindex: e.target.value })}
            helperText="Optional: Unique identifier for JSON import/export"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.name.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ViewContainer>
  );
};

export default ProjectList;
