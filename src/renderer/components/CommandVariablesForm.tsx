/**
 * CommandVariablesForm
 *
 * Form component for editing command variables
 * Displays variable inputs and execute button
 */

import React from 'react';
import { Box, Typography, TextField, Select, MenuItem, FormControl, Chip } from '@mui/material';

interface Variable {
  name: string;
  detail: string;
  type?: string;
  format?: string;
  options?: string[];
}

interface CommandVariablesFormProps {
  variables: Variable[];
  variableValues: Record<string, string>;
  onVariableChange: (variableName: string, value: string) => void;
}

const CommandVariablesForm: React.FC<CommandVariablesFormProps> = ({
  variables,
  variableValues,
  onVariableChange,
}) => {
  const getVariableStatus = (variableName: string): 'filled' | 'empty' => {
    return variableValues[variableName]?.trim() ? 'filled' : 'empty';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Variables
      </Typography>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {variables.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No variables required for this command.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {variables.map((variable) => (
              <Box key={variable.name}>
                <Typography variant="subtitle2" gutterBottom>
                  {variable.name}
                  {variable.format && (
                    <Chip label={variable.format} size="small" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  {variable.detail}
                </Typography>

                {variable.type === 'option' && variable.options ? (
                  <FormControl fullWidth size="small">
                    <Select
                      value={variableValues[variable.name] || ''}
                      onChange={(e) => onVariableChange(variable.name, e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Select option</em>
                      </MenuItem>
                      {variable.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    value={variableValues[variable.name] || ''}
                    onChange={(e) => onVariableChange(variable.name, e.target.value)}
                    placeholder={`Enter ${variable.name}`}
                  />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

    </Box>
  );
};

export default CommandVariablesForm;
