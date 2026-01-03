import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import { ArrowBack, PlayArrow } from '@mui/icons-material';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCommand, clearCurrentCommand } from '@store/commandsSlice';
import { fetchProjects } from '@store/projectsSlice';

// Utils
import { applyFormat } from '@utils/formatValidation';

// Types
import { Variable, VariableValue } from '@tstypes/dbmodules';

// Custom components
import Terminal from '@components/Terminal';

const CommandDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentCommand } = useAppSelector((state) => state.commands);
  const { projects } = useAppSelector((state) => state.projects);

  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [finalCommand, setFinalCommand] = useState('');
  const [editableCommand, setEditableCommand] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [selectedProjectPath, setSelectedProjectPath] = useState('');

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
    if (!currentCommand || currentCommand.steps.length === 0) return false;
    const variables = currentCommand.steps[0].variables || [];
    return variables.every((v) => variableValues[v.name]?.trim());
  };

  const getVariableStatus = (variableName: string): 'filled' | 'empty' => {
    return variableValues[variableName]?.trim() ? 'filled' : 'empty';
  };

  const handleExecute = () => {
    setShowTerminal(true);
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

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/commands')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">{currentCommand.name}</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ flex: 1, py: 4, overflow: 'auto', pr: 2 }}>
          <Typography variant="h4" gutterBottom>
            {currentCommand.name}
          </Typography>

          <Typography variant="body1" paragraph color="text.secondary">
            {currentCommand.detail}
          </Typography>

          <Divider sx={{ my: 3 }} />

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
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
          </Box>

          {currentCommand.project && currentCommand.project.length > 0 && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Execution Path</InputLabel>
              <Select
                value={selectedProjectPath}
                label="Execution Path"
                onChange={(e) => setSelectedProjectPath(e.target.value)}
              >
                <MenuItem value="">Default (current directory)</MenuItem>
                {currentCommand.project.map((projectId) => {
                  const project = projects.find((p) => p.id === projectId);
                  return project ? (
                    <MenuItem key={project.id} value={project.path || ''}>
                      {project.name} {project.path ? `(${project.path})` : ''}
                    </MenuItem>
                  ) : null;
                })}
              </Select>
            </FormControl>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<PlayArrow />}
            onClick={handleExecute}
            disabled={!allVariablesFilled()}
            sx={{ mb: 3 }}
          >
            Execute Command
          </Button>

          {!allVariablesFilled() && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Please fill in all variables before executing the command.
            </Alert>
          )}

          {showTerminal && (
            <Paper sx={{ p: 2, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Terminal Output
              </Typography>
              <Terminal command={finalCommand} workingDir={selectedProjectPath} />
            </Paper>
          )}
        </Container>

        <Paper
          sx={{
            width: 350,
            p: 3,
            overflow: 'auto',
            borderLeft: '1px solid',
            borderColor: 'divider',
            borderRadius: 0,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Variables
          </Typography>

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
                      <Chip
                        label={variable.format}
                        size="small"
                        sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    {variable.detail}
                  </Typography>

                  {variable.type === 'option' && variable.options ? (
                    <FormControl fullWidth size="small">
                      <Select
                        value={variableValues[variable.name] || ''}
                        onChange={(e) => handleVariableChange(variable.name, e.target.value)}
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
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      placeholder={`Enter ${variable.name}`}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default CommandDetail;
