/**
 * SelectProjects
 *
 * Multi-select autocomplete for filtering commands by projects.
 * Renders chips for each selected project.
 * Handles its own fetching of projects from Redux.
 */

import React, { useEffect } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchProjects } from '@store/projectsSlice';

interface SelectProjectsProps {
  value: string[];
  onChange: (projectNames: string[]) => void;
}

const SelectProjects: React.FC<SelectProjectsProps> = ({ value, onChange }) => {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <Autocomplete
      multiple
      fullWidth
      options={projects.map((p) => p.name)}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => <TextField {...params} label="Projects" placeholder="Select projects" />}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => <Chip {...getTagProps({ index })} key={option} label={option} size="small" />)
      }
    />
  );
};

export default SelectProjects;
