/**
 * SelectProjectPath
 *
 * Select dropdown for choosing execution path based on command projects.
 * Shows projects that are associated with the current command.
 */

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface Project {
  id?: number;
  name: string;
  path?: string;
}

interface SelectProjectPathProps {
  value: string;
  onChange: (path: string) => void;
  commandProjects: string[];
  allProjects: Project[];
  className?: string;
}

const SelectProjectPath: React.FC<SelectProjectPathProps> = ({
  value,
  onChange,
  commandProjects,
  allProjects,
  className,
}) => {
  return (
    <FormControl fullWidth className={className}>
      <InputLabel>Execution Path</InputLabel>
      <Select value={value} label="Execution Path" onChange={(e) => onChange(e.target.value)}>
        <MenuItem value="">Default (current directory)</MenuItem>
        {commandProjects.map((projectName: string) => {
          const project = allProjects.find((p) => p.name === projectName);
          return project ? (
            <MenuItem key={project.name} value={project.path || ''}>
              {project.name} {project.path ? `(${project.path})` : ''}
            </MenuItem>
          ) : null;
        })}
      </Select>
    </FormControl>
  );
};

export default SelectProjectPath;
