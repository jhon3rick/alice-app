import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Chip,
} from '@mui/material';
import { CommandTemplate } from '@types/index';

interface ModalNewCommandProps {
  open: boolean;
  editingCommand: CommandTemplate | null;
  onClose: () => void;
  onSave: (formData: {
    name: string;
    resumen: string;
    detail: string;
    tags: string[];
    codeindex?: string;
  }) => void;
  availableTags: string[];
}

const ModalNewCommand: React.FC<ModalNewCommandProps> = ({
  open,
  editingCommand,
  onClose,
  onSave,
  availableTags,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    resumen: '',
    detail: '',
    tags: [] as string[],
    codeindex: '',
  });

  useEffect(() => {
    if (editingCommand) {
      setFormData({
        name: editingCommand.name,
        resumen: editingCommand.resumen,
        detail: editingCommand.detail,
        tags: editingCommand.tags || [],
        codeindex: editingCommand.codeindex || '',
      });
    } else {
      setFormData({
        name: '',
        resumen: '',
        detail: '',
        tags: [],
        codeindex: '',
      });
    }
  }, [editingCommand, open]);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.resumen.trim()) return;

    onSave({
      name: formData.name,
      resumen: formData.resumen,
      detail: formData.detail,
      tags: formData.tags,
      codeindex: formData.codeindex || undefined,
    });

    setFormData({
      name: '',
      resumen: '',
      detail: '',
      tags: [],
      codeindex: '',
    });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      resumen: '',
      detail: '',
      tags: [],
      codeindex: '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{editingCommand ? 'Edit Command' : 'Add Command'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Command Name"
          fullWidth
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Summary"
          fullWidth
          value={formData.resumen}
          onChange={(e) => setFormData({ ...formData, resumen: e.target.value })}
          helperText="Brief description of the command"
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Detail"
          fullWidth
          multiline
          rows={3}
          value={formData.detail}
          onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
          helperText="Detailed description of the command"
          sx={{ mb: 2 }}
        />
        <Autocomplete
          multiple
          fullWidth
          options={availableTags}
          value={formData.tags}
          onChange={(_, newValue) => setFormData({ ...formData, tags: newValue })}
          renderInput={(params) => (
            <TextField {...params} label="Tags" placeholder="Select tags" />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
            ))
          }
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
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formData.name.trim() || !formData.resumen.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalNewCommand;
