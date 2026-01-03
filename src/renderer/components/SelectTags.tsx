/**
 * SelectTags
 *
 * Multi-select autocomplete for filtering commands by tags.
 * Renders chips for each selected tag.
 * Handles its own fetching of tags from Redux.
 */

import React, { useEffect } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchTags } from '@store/tagsSlice';

interface SelectTagsProps {
  value: string[];
  onChange: (tagNames: string[]) => void;
}

const SelectTags: React.FC<SelectTagsProps> = ({ value, onChange }) => {
  const dispatch = useAppDispatch();
  const { tags } = useAppSelector((state) => state.tags);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  return (
    <Autocomplete
      multiple
      fullWidth
      options={tags.map((t) => t.name)}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Filter by Tags" placeholder="Select tags" />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
        ))
      }
    />
  );
};

export default SelectTags;
