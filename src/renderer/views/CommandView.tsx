/**
 * CommandView
 *
 * View component for displaying and editing command details.
 * Allows editing command properties and executing the command.
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCommand, clearCurrentCommand } from '@store/commandsSlice';
import { fetchProjects } from '@store/projectsSlice';

// Custom Components
import ViewContainer from '@ui/ViewContainer';
import CommandVariablesForm from '@components/CommandVariablesForm';
import XtermTerminal from '@components/XtermTerminal';
import SelectProjectPath from '@components/SelectProjectPath';

// Utils
import { applyFormat } from '@utils/formatValidation';

// Styles
import './CommandView.scss';

const CommandView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { currentCommand } = useAppSelector((state) => state.commands);
  const { projects } = useAppSelector((state) => state.projects);

  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [finalCommand, setFinalCommand] = useState('');
  const [editableCommand, setEditableCommand] = useState('');
  const [selectedProjectPath, setSelectedProjectPath] = useState('');
  const [commandToExecute, setCommandToExecute] = useState<{ command: string; timestamp: number } | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchCommand(Number(id)));
      dispatch(fetchProjects());
    }
    return () => {
      dispatch(clearCurrentCommand());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentCommand && currentCommand.steps.length > 0) {
      const initialCommand = currentCommand.steps[0].command;
      setEditableCommand(initialCommand);
      updateFinalCommand(initialCommand, {});
    }
  }, [currentCommand]);

  const updateFinalCommand = (command: string, values: Record<string, string>) => {
    let result = command;
    const variables = currentCommand?.steps[0]?.variables || [];

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

    if (currentCommand && currentCommand.steps.length > 0) {
      updateFinalCommand(currentCommand.steps[0].command, newValues);
    }
  };

  const handleCommandEdit = (value: string) => {
    setEditableCommand(value);
    setFinalCommand(value);
  };

  const allVariablesFilled = () => {
    if (!currentCommand || currentCommand.steps.length === 0) return true;
    const variables = currentCommand.steps[0].variables || [];
    if (variables.length === 0) return true;
    return variables.every((v) => variableValues[v.name]?.trim());
  };

  const getVariableStatus = (variableName: string): 'filled' | 'empty' => {
    return variableValues[variableName]?.trim() ? 'filled' : 'empty';
  };

  const handleExecute = () => {
    setCommandToExecute({ command: finalCommand, timestamp: Date.now() });
  };

  if (!currentCommand) {
    return (
      <Box className="command-view__loading">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const step = currentCommand.steps[0];
  const variables = step?.variables || [];
  const hasVariables = variables.length > 0;

  return (
    <ViewContainer title={currentCommand.name}>
      {/* Main content area */}
      <Box className="command-view__container">
        {/* Top section: Command editor and sidebar - scrollable content */}
        <Box className="command-view__content" sx={{ borderColor: 'divider' }}>
          {/* Left: Command editor */}
          <Box className="command-view__editor">
            <Typography variant="h6" className="command-view__title" gutterBottom>
              Command Preview
            </Typography>

            <Paper className="command-view__preview">
              <TextField
                fullWidth
                multiline
                value={editableCommand}
                onChange={(e) => handleCommandEdit(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  className: 'command-view__preview-field',
                }}
              />
            </Paper>

            <Box className="command-view__variables-section">
              <Typography variant="body2" color="text.secondary" className="command-view__variables-label" gutterBottom>
                Variables in command:
              </Typography>
              <Box className="command-view__variables-chips">
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
                className="command-view__execute-button"
                startIcon={<PlayArrow />}
                onClick={handleExecute}
                disabled={hasVariables && !allVariablesFilled()}
              >
                Execute Command
              </Button>
            </Box>

            {currentCommand.projects && currentCommand.projects.length > 0 && (
              <SelectProjectPath
                value={selectedProjectPath}
                onChange={setSelectedProjectPath}
                commandProjects={currentCommand.projects}
                allProjects={projects}
                className="command-view__project-select"
              />
            )}
          </Box>

          {/* Right sidebar: Variables form */}
          {hasVariables && (
            <Paper
              className="command-view__sidebar"
              sx={{
                height: 'fit-content',
                borderColor: 'divider',
              }}
            >
              <CommandVariablesForm
                variables={variables}
                variableValues={variableValues}
                onVariableChange={handleVariableChange}
              />
            </Paper>
          )}
        </Box>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 300, backgroundColor: '#2d2d30', borderTop: '1px solid #e0e0e0' }}>

        </div>

        {/* Bottom section: Terminal (fixed height 250px) */}
        <Box className="command-view__terminal">
          <XtermTerminal workingDir={selectedProjectPath || undefined} commandToExecute={commandToExecute?.command} />
        </Box>
      </Box>
    </ViewContainer>
  );
};

export default CommandView;
