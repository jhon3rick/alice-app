/**
 * CommandView
 *
 * View component for displaying and editing command details.
 * Allows editing command properties and executing the command.
 */

import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCommand, clearCurrentCommand } from '@store/commandsSlice';
import { fetchProjects } from '@store/projectsSlice';

// Custom Components
import ViewContainer from '@ui/ViewContainer';
import CommandVariablesForm from '@components/CommandVariablesForm';

// Utils
import { applyFormat } from '@utils/formatValidation';

// Lazy load terminal component
const XtermTerminal = lazy(() => import('@components/XtermTerminal'));

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
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Top section: Command editor and sidebar - scrollable content */}
        <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider', flex: 1, overflow: 'auto' }}>
          {/* Left: Command editor */}
          <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Command Preview
            </Typography>

            <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5', fontFamily: 'monospace' }}>
              <TextField
                fullWidth
                multiline
                value={editableCommand}
                onChange={(e) => handleCommandEdit(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  style: { fontFamily: 'monospace', fontSize: '14px' },
                }}
              />
            </Paper>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Variables in command:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
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
                fullWidth
                startIcon={<PlayArrow />}
                onClick={handleExecute}
                disabled={hasVariables && !allVariablesFilled()}
              >
                Execute Command
              </Button>
            </Box>

            {currentCommand.projects && currentCommand.projects.length > 0 && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Execution Path</InputLabel>
                <Select value={selectedProjectPath} label="Execution Path" onChange={(e) => setSelectedProjectPath(e.target.value)}>
                  <MenuItem value="">Default (current directory)</MenuItem>
                  {currentCommand.projects.map((projectName: string) => {
                    const project = projects.find((p) => p.name === projectName);
                    return project ? (
                      <MenuItem key={project.name} value={project.path || ''}>
                        {project.name} {project.path ? `(${project.path})` : ''}
                      </MenuItem>
                    ) : null;
                  })}
                </Select>
              </FormControl>
            )}
          </Box>

          {/* Right sidebar: Variables form */}
          {hasVariables && (
            <Paper
              sx={{
                width: 350,
                p: 3,
                borderLeft: '1px solid',
                borderColor: 'divider',
                borderRadius: 0,
                display: 'flex',
                flexDirection: 'column',
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

        {/* Bottom section: Terminal (fixed height 250px) */}
        <Box sx={{ height: '250px', flexShrink: 0, mt: 2 }}>
          <Suspense
            fallback={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  bgcolor: '#1e1e1e',
                  gap: 2,
                }}
              >
                <CircularProgress size={40} sx={{ color: '#4ec9b0' }} />
                <Typography variant="body2" sx={{ color: '#cccccc' }}>
                  Loading terminal...
                </Typography>
              </Box>
            }
          >
            <XtermTerminal workingDir={selectedProjectPath || undefined} commandToExecute={commandToExecute?.command} />
          </Suspense>
        </Box>
      </Box>
    </ViewContainer>
  );
};

export default CommandView;
