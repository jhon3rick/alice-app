import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { FolderOpen } from '@mui/icons-material';

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  sx?: string;
}

const SelectFolder: React.FC<Props> = ({ label = 'Folder', value, onChange, helperText, sx }) => {
  const handleBrowse = async () => {
    const selected = await (window as any).electronAPI.selectFolder();
    if (selected) onChange(selected);
  };

  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onClick={handleBrowse}
      InputProps={{
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                handleBrowse();
              }}
            >
              <FolderOpen />
            </IconButton>
          </InputAdornment>
        ),
      }}
      inputProps={{ readOnly: true }}
      helperText={helperText}
      sx={sx}
    />
  );
};

export default SelectFolder;