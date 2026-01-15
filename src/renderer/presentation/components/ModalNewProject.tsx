/**
 * ModalNewProject
 *
 * Modal component for creating or editing projects.
 * Provides form fields for project name, path, and code index.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

// Types
import { Project } from '@tstypes/dbmodules';

interface ModalNewProjectProps {
  open: boolean;
  editingProject: Project | null;
  onClose: () => void;
  onSave: (formData: { name: string; path: string; codeindex: string }) => void;
}

const ModalNewProject: React.FC<ModalNewProjectProps> = ({ open, editingProject, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', path: '', codeindex: '' });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        name: editingProject.name,
        path: editingProject.path || '',
        codeindex: editingProject.codeindex,
      });
    } else {
      setFormData({ name: '', path: '', codeindex: '' });
    }
  }, [editingProject, open]);

  const handleSave = () => {
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  // Form field change handlers
  const handleInputChange = useCallback((field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleExited = useCallback(() => {
    setFormData({ name: '', path: '', codeindex: '' });
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth TransitionProps={{ onExited: handleExited }}>
      <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Project Name"
          fullWidth
          value={formData.name}
          onChange={handleInputChange('name')}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Project Path"
          fullWidth
          value={formData.path}
          onChange={handleInputChange('path')}
          helperText="Optional: Specific directory path for command execution"
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Code Index"
          fullWidth
          value={formData.codeindex}
          onChange={handleInputChange('codeindex')}
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
