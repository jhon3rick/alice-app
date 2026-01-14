/**
 * ModalNewTag
 *
 * Modal component for creating or editing tags.
 * Provides form fields for tag name, code index, and icon selection.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

// Components
import SelectDevIcon from '@ui/SelectDevIcon';

// Types
import { Tag } from '@tstypes/dbmodules';

interface ModalNewTagProps {
  open: boolean;
  editingTag: Tag | null;
  onClose: () => void;
  onSave: (formData: { name: string; codeindex?: string; icon?: string }) => void;
}

const ModalNewTag: React.FC<ModalNewTagProps> = ({ open, editingTag, onClose, onSave }) => {
  const [formData, setFormData] = useState<Tag>({ name: '', codeindex: '', icon: '' });

  useEffect(() => {
    if (editingTag) {
      setFormData({
        name: editingTag.name,
        codeindex: editingTag.codeindex || '',
        icon: editingTag.icon || '',
      });
    } else {
      setFormData({ name: '', codeindex: '', icon: '' });
    }
  }, [editingTag, open]);

  const handleSave = () => {
    if (!formData.name.trim()) return;

    onSave({
      name: formData.name,
      codeindex: formData.codeindex,
      icon: formData.icon || undefined,
    });

    setFormData({ name: '', codeindex: '', icon: '' });
  };

  // Form field change handlers
  const handleChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  }, []);

  const handleChangeCodeIndex = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, codeindex: e.target.value }));
  }, []);

  const handleChangeIcon = useCallback((icon: string) => {
    setFormData((prev) => ({ ...prev, icon }));
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleExited = useCallback(() => {
    setFormData({ name: '', codeindex: '', icon: '' });
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth TransitionProps={{ onExited: handleExited }}>
      <DialogTitle>{editingTag ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tag Name"
          fullWidth
          value={formData.name}
          onChange={handleChangeName}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Code Index"
          fullWidth
          value={formData.codeindex}
          onChange={handleChangeCodeIndex}
          helperText="Optional: Unique identifier for JSON import/export"
          sx={{ mb: 3 }}
        />

        <Box sx={{ mt: 2 }}>
          <SelectDevIcon
            label="Select Icon (Optional)"
            value={formData.icon}
            onChange={handleChangeIcon}
          />
        </Box>
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
