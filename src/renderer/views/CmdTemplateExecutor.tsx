/**
 * CmdTemplateExecutor
 *
 * View component for displaying and editing command template details.
 * Allows editing command properties and executing the command template.
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Chip,
  Paper,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCommandTemplate, clearCurrentCommandTemplate } from '@store/commandTemplatesSlice';
import { fetchProjects } from '@store/projectsSlice';

// Custom Components
import ViewContainer from '@ui/ViewContainer';
import CmdVariablesForm from '@components/CmdVariablesForm';
import XtermTerminal from '@components/XtermTerminal';
import SelectProjectPath from '@components/SelectProjectPath';

// Utils
import { applyFormat } from '@utils/formatValidation';

// Styles
import './CmdTemplateExecutor.scss';

const CmdTemplateExecutor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { currentCommandTemplate } = useAppSelector((state) => state.commandTemplates);
  const { projects } = useAppSelector((state) => state.projects);

  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [finalCommand, setFinalCommand] = useState('');
  const [editableCommand, setEditableCommand] = useState('');
  const [selectedProjectPath, setSelectedProjectPath] = useState('');
  const [commandToExecute, setCommandToExecute] = useState<{ command: string; timestamp: number } | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchCommandTemplate(Number(id)));
      dispatch(fetchProjects());
    }
    return () => {
      dispatch(clearCurrentCommandTemplate());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentCommandTemplate && currentCommandTemplate.steps.length > 0) {
      const initialCommand = currentCommandTemplate.steps[0].command;
      setEditableCommand(initialCommand);
      updateFinalCommand(initialCommand, {});
    }
  }, [currentCommandTemplate]);

  const updateFinalCommand = (command: string, values: Record<string, string>) => {
    let result = command;
    const variables = currentCommandTemplate?.steps[0]?.variables || [];

    variables.forEach((variable) => {
      const value = values[variable.name] || '';
      const formattedValue = value ? applyFormat(value, variable.format) : '';
      const placeholder = `{{${variable.name}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), formattedValue);
    });

    setFinalCommand(result);
  };

  const handleVariableChange = (variableName: string, value: string) => {
    const newValues = { ...variableValues, [variableName]: value };
    setVariableValues(newValues);

    if (currentCommandTemplate && currentCommandTemplate.steps.length > 0) {
      updateFinalCommand(currentCommandTemplate.steps[0].command, newValues);
    }
  };

  const handleCommandEdit = (value: string) => {
    setEditableCommand(value);
    setFinalCommand(value);
  };

  const allVariablesFilled = () => {
    if (!currentCommandTemplate || currentCommandTemplate.steps.length === 0) return true;
    const variables = currentCommandTemplate.steps[0].variables || [];
    if (variables.length === 0) return true;
    return variables.every((v) => variableValues[v.name]?.trim());
  };

  const getVariableStatus = (variableName: string): 'filled' | 'empty' => {
    return variableValues[variableName]?.trim() ? 'filled' : 'empty';
  };

  const handleExecute = () => {
    setCommandToExecute({ command: finalCommand, timestamp: Date.now() });
  };

  if (!currentCommandTemplate) {
    return (
      <Box className="cmd-template-executor__loading">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const step = currentCommandTemplate.steps[0];
  const variables = step?.variables || [];
  const hasVariables = variables.length > 0;

  return (
    <ViewContainer title={currentCommandTemplate.name}>
      {/* Main content area */}
      <Box className="cmd-template-executor__container">
        {/* Top section: Command editor and sidebar - scrollable content */}
        <Box className="cmd-template-executor__content" sx={{ borderColor: 'divider' }}>
          {/* Left: Command editor */}
          <Box className="cmd-template-executor__editor">
            <Typography variant="h6" className="cmd-template-executor__title" gutterBottom>
              Command Preview
            </Typography>

            <Paper className="cmd-template-executor__preview">
              <TextField
                fullWidth
                multiline
                value={editableCommand}
                onChange={(e) => handleCommandEdit(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  className: 'cmd-template-executor__preview-field',
                }}
              />
            </Paper>

            <Box className="cmd-template-executor__variables-section">
              <Typography variant="body2" color="text.secondary" className="cmd-template-executor__variables-label" gutterBottom>
                Variables in command:
              </Typography>
              <Box className="cmd-template-executor__variables-chips">
                {variables.map((variable) => (
                  <Chip
                    key={variable.name}
                    label={`{{${variable.name}}}`}
                    size="small"
                    color={getVariableStatus(variable.name) === 'filled' ? 'success' : 'warning'}
                    onDelete={() => handleVariableChange(variable.name, '')}
                  />
                ))}
              </Box>

              {/* Execute button below tags */}
              <Button
                variant="contained"
                size="large"
                className="cmd-template-executor__execute-button"
                startIcon={<PlayArrow />}
                onClick={handleExecute}
                disabled={hasVariables && !allVariablesFilled()}
              >
                Execute Command
              </Button>
            </Box>

            {currentCommandTemplate.projects && currentCommandTemplate.projects.length > 0 && (
              <SelectProjectPath
                value={selectedProjectPath}
                onChange={setSelectedProjectPath}
                commandProjects={currentCommandTemplate.projects}
                allProjects={projects}
                className="cmd-template-executor__project-select"
              />
            )}
          </Box>

          {/* Right sidebar: Variables form */}
          {hasVariables && (
            <Paper
              className="cmd-template-executor__sidebar"
              sx={{
                height: 'fit-content',
                borderColor: 'divider',
              }}
            >
              <CmdVariablesForm
                variables={variables}
                variableValues={variableValues}
                onVariableChange={handleVariableChange}
              />
            </Paper>
          )}
        </Box>

        {/* Bottom section: Terminal (fixed height 300px) */}
        <Box className="cmd-template-executor__terminal">
          <XtermTerminal workingDir={selectedProjectPath || undefined} commandToExecute={commandToExecute?.command} />
        </Box>
      </Box>
    </ViewContainer>
  );
};

export default CmdTemplateExecutor;
