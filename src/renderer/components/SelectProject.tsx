/**
 * SelectProject
 *
 * Select dropdown for filtering commands by project.
 * Includes "All Projects" option to show all.
 * Handles its own fetching of projects from Redux.
 */

import React, { useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchProjects } from '@store/projectsSlice';

interface SelectProjectProps {
  value: number | '';
  onChange: (projectId: number | '') => void;
}

const SelectProject: React.FC<SelectProjectProps> = ({ value, onChange }) => {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <FormControl fullWidth>
      <InputLabel>Filter by Project</InputLabel>
      <Select
        value={value}
        label="Filter by Project"
        onChange={(e) => onChange(e.target.value as number | '')}
      >
        <MenuItem value="">All Projects</MenuItem>
        {projects.map((project) => (
          <MenuItem key={project.id} value={project.id}>
            {project.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectProject;
