/**
 * CmdVariablesForm
 *
 * Form component for editing command variables
 * Displays variable inputs and execute button
 */

import React from 'react';
import { Box, Typography, TextField, Select, MenuItem, FormControl, Chip } from '@mui/material';
import VariableHelpButton from './VariableHelpButton';

import './CmdVariablesForm.scss';

interface Variable {
  name: string;
  detail: string;
  type?: string;
  format?: string;
  options?: string[];
}

interface CmdVariablesFormProps {
  variables: Variable[];
  variableValues: Record<string, string>;
  onVariableChange: (variableName: string, value: string) => void;
}

const CmdVariablesForm: React.FC<CmdVariablesFormProps> = ({
  variables,
  variableValues,
  onVariableChange,
}) => {
  return (
    <Box className="command-variables-form">
      <Typography variant="h6" gutterBottom className="command-variables-form__title">
        Variables
      </Typography>

      <Box className="command-variables-form__content">
        {variables.length === 0 ? (
          <Typography variant="body2" color="text.secondary" className="command-variables-form__empty-message">
            No variables required for this command.
          </Typography>
        ) : (
          <Box className="command-variables-form__variables-container">
            {variables.map((variable) => (
              <Box key={variable.name} className="command-variables-form__variable">
                <Box className="command-variables-form__variable-header">
                  <VariableHelpButton
                    variableName={variable.name}
                    variableDetail={variable.detail}
                  />
                  <Typography variant="subtitle2" className="command-variables-form__variable-title">
                    {variable.name}
                    {variable.format && (
                      <Chip label={variable.format} size="small" className="command-variables-form__variable-chip" />
                    )}
                  </Typography>
                </Box>

                {variable.type === 'option' && variable.options ? (
                  <FormControl fullWidth size="small" className="command-variables-form__select">
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
                    className="command-variables-form__input"
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

export default CmdVariablesForm;
