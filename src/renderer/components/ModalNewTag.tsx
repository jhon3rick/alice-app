/**
 * ModalNewTag
 *
 * Modal component for creating or editing tags.
 * Provides form fields for tag name and code index.
 */

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
import { Tag } from '@tstypes/dbmodules';

interface ModalNewTagProps {
  open: boolean;
  editingTag: Tag | null;
  onClose: () => void;
  onSave: (formData: { name: string; codeindex?: string }) => void;
}

const ModalNewTag: React.FC<ModalNewTagProps> = ({ open, editingTag, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', codeindex: '' });

  useEffect(() => {
    if (editingTag) {
      setFormData({
        name: editingTag.name,
        codeindex: editingTag.codeindex || '',
      });
    } else {
      setFormData({ name: '', codeindex: '' });
    }
  }, [editingTag, open]);

  const handleSave = () => {
    if (!formData.name.trim()) return;

    onSave({
      name: formData.name,
      codeindex: formData.codeindex || undefined,
    });

    setFormData({ name: '', codeindex: '' });
  };

  const handleClose = () => {
    setFormData({ name: '', codeindex: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingTag ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tag Name"
          fullWidth
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

export default ModalNewTag;
