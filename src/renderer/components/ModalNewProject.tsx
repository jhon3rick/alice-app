import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

// Types
import { Project } from '@tstypes/dbmodules';

interface ModalNewProjectProps {
  open: boolean;
  editingProject: Project | null;
  onClose: () => void;
  onSave: (formData: { name: string; path?: string; codeindex?: string }) => void;
}

const ModalNewProject: React.FC<ModalNewProjectProps> = ({ open, editingProject, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', path: '', codeindex: '' });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        name: editingProject.name,
        path: editingProject.path || '',
        codeindex: editingProject.codeindex || '',
      });
    } else {
      setFormData({ name: '', path: '', codeindex: '' });
    }
  }, [editingProject, open]);

  const handleSave = () => {
    if (!formData.name.trim()) return;

    onSave({
      name: formData.name,
      path: formData.path || undefined,
      codeindex: formData.codeindex || undefined,
    });

    setFormData({ name: '', path: '', codeindex: '' });
  };

  const handleClose = () => {
    setFormData({ name: '', path: '', codeindex: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!formData.name.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalNewProject;
