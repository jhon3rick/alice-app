/**
 * CommandCreate
 *
 * View component for creating and editing commands with full form.
 * Includes project selector, tags selector, name field, and JSON textarea for steps configuration.
 * Validates JSON and Step[] interface before saving.
 * Supports both create mode (/commands/new) and edit mode (/commands/:id/edit).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addCommand, modifyCommand, fetchCommand, clearCurrentCommand } from '@store/commandsSlice';

// Types
import type { Step, Command } from '@tstypes/dbmodules';

// Custom Components
import ViewContainer from '@ui/ViewContainer';
import SelectProjects from '@components/SelectProjects';
import SelectTags from '@components/SelectTags';

import './CommandCreate.scss';

const CommandCreate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const { currentCommand } = useAppSelector((state) => state.commands);

  const isEditMode = !!id;

  const [name, setName] = useState('');
  const [resumen, setResumen] = useState('');
  const [detail, setDetail] = useState('');
  const [codeindex, setCodeindex] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [stepsJson, setStepsJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchCommand(Number(id)));
    }

    return () => {
      dispatch(clearCurrentCommand());
    };
  }, [dispatch, isEditMode, id]);

  // Load command data when editing
  useEffect(() => {
    if (isEditMode && currentCommand) {
      setName(currentCommand.name);
      setResumen(currentCommand.resumen);
      setDetail(currentCommand.detail || '');
      setCodeindex(currentCommand.codeindex || '');
      setSelectedProjects(currentCommand.projects || []);
      setSelectedTags(currentCommand.tags || []);
      setStepsJson(JSON.stringify(currentCommand.steps, null, 2));
    }
  }, [isEditMode, currentCommand]);

  // Validate JSON syntax
  const validateJson = (jsonString: string): boolean => {
    if (!jsonString.trim()) {
      setJsonError(null);
      return false;
    }

    try {
      JSON.parse(jsonString);
      setJsonError(null);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        setJsonError(`Invalid JSON: ${error.message}`);
      }
      return false;
    }
  };

  // Validate Step[] interface
  const validateStepsInterface = (steps: any): steps is Step[] => {
    if (!Array.isArray(steps)) {
      setValidationError('Steps must be an array');
      return false;
    }

    if (steps.length === 0) {
      setValidationError('Steps array cannot be empty');
      return false;
    }

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      if (typeof step !== 'object' || step === null) {
        setValidationError(`Step ${i + 1}: Must be an object`);
        return false;
      }

      if (typeof step.name !== 'string' || !step.name.trim()) {
        setValidationError(`Step ${i + 1}: Missing or invalid 'name' (must be non-empty string)`);
        return false;
      }

      if (typeof step.detail !== 'string') {
        setValidationError(`Step ${i + 1}: Missing or invalid 'detail' (must be string)`);
        return false;
      }

      if (typeof step.command !== 'string' || !step.command.trim()) {
        setValidationError(`Step ${i + 1}: Missing or invalid 'command' (must be non-empty string)`);
        return false;
      }

      if (!Array.isArray(step.variables)) {
        setValidationError(`Step ${i + 1}: Missing or invalid 'variables' (must be array)`);
        return false;
      }

      // Validate each variable
      for (let j = 0; j < step.variables.length; j++) {
        const variable = step.variables[j];

        if (typeof variable !== 'object' || variable === null) {
          setValidationError(`Step ${i + 1}, Variable ${j + 1}: Must be an object`);
          return false;
        }

        if (typeof variable.name !== 'string' || !variable.name.trim()) {
          setValidationError(`Step ${i + 1}, Variable ${j + 1}: Missing or invalid 'name' (must be non-empty string)`);
          return false;
        }

        const validTypes = ['string', 'option', 'number', 'boolean'];
        if (!validTypes.includes(variable.type)) {
          setValidationError(
            `Step ${i + 1}, Variable ${j + 1}: Invalid 'type' (must be one of: ${validTypes.join(', ')})`
          );
          return false;
        }

        if (typeof variable.detail !== 'string') {
          setValidationError(`Step ${i + 1}, Variable ${j + 1}: Missing or invalid 'detail' (must be string)`);
          return false;
        }

        // Optional format validation
        if (variable.format !== undefined) {
          const validFormats = ['snake_case', 'camelCase', 'upperCamelCase', 'kebab-case', 'UPPER_CASE'];
          if (!validFormats.includes(variable.format)) {
            setValidationError(
              `Step ${i + 1}, Variable ${j + 1}: Invalid 'format' (must be one of: ${validFormats.join(', ')})`
            );
            return false;
          }
        }

        // Options validation for 'option' type
        if (variable.type === 'option') {
          if (!Array.isArray(variable.options) || variable.options.length === 0) {
            setValidationError(
              `Step ${i + 1}, Variable ${j + 1}: 'options' is required and must be non-empty array for type 'option'`
            );
            return false;
          }

          if (!variable.options.every((opt: any) => typeof opt === 'string')) {
            setValidationError(`Step ${i + 1}, Variable ${j + 1}: All 'options' must be strings`);
            return false;
          }
        }
      }
    }

    setValidationError(null);
    return true;
  };

  const handleStepsJsonChange = (value: string) => {
    setStepsJson(value);
    validateJson(value);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!name.trim()) {
      setValidationError('Command name is required');
      return;
    }

    if (!resumen.trim()) {
      setValidationError('Summary is required');
      return;
    }

    if (!stepsJson.trim()) {
      setValidationError('Steps configuration is required');
      return;
    }

    // Validate JSON
    if (!validateJson(stepsJson)) {
      return;
    }

    // Parse and validate steps
    let parsedSteps: any;
    try {
      parsedSteps = JSON.parse(stepsJson);
    } catch (error) {
      setValidationError('Failed to parse JSON');
      return;
    }

    if (!validateStepsInterface(parsedSteps)) {
      return;
    }

    // Create or update command object
    const commandData: Command = {
      ...(isEditMode && currentCommand?.id ? { id: currentCommand.id } : {}),
      name: name.trim(),
      resumen: resumen.trim(),
      detail: detail.trim(),
      codeindex: codeindex.trim() || undefined,
      projects: selectedProjects,
      tags: selectedTags,
      steps: parsedSteps,
    };

    try {
      if (isEditMode) {
        await dispatch(modifyCommand(commandData)).unwrap();
      } else {
        await dispatch(addCommand(commandData)).unwrap();
      }
      navigate('/commands');
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} command:`, error);
      setValidationError(`Failed to ${isEditMode ? 'update' : 'create'} command. Please try again.`);
    }
  };

  const handleCancel = () => {
    navigate('/commands');
  };

  return (
    <ViewContainer title={isEditMode ? 'Edit Command' : 'Create Command'}>
      <Box className="command-create">
        <Box className="command-create__form">
          <TextField
            label="Command Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Run Tests"
            sx={{ mb: 2 }}
          />

          <TextField
            label="Summary"
            fullWidth
            required
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            placeholder="Brief description of the command"
            helperText="A short summary that describes what this command does"
            sx={{ mb: 2 }}
          />

          <TextField
            label="Detail"
            fullWidth
            multiline
            rows={3}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Detailed description..."
            helperText="Optional: Detailed explanation of the command"
            sx={{ mb: 2 }}
          />

          <TextField
            label="Code Index"
            fullWidth
            value={codeindex}
            onChange={(e) => setCodeindex(e.target.value)}
            placeholder="e.g., CMD_001"
            helperText="Optional: Unique identifier for JSON import/export"
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <SelectProjects value={selectedProjects} onChange={setSelectedProjects} />
          </Box>

          <Box sx={{ mb: 2 }}>
            <SelectTags value={selectedTags} onChange={setSelectedTags} />
          </Box>

          <Box className="command-create__json-section">
            <TextField
              label="Steps Configuration (JSON)"
              fullWidth
              required
              multiline
              rows={16}
              value={stepsJson}
              onChange={(e) => handleStepsJsonChange(e.target.value)}
              placeholder={`[\n  {\n    "name": "Step 1",\n    "detail": "Description",\n    "command": "npm test {{testName}}",\n    "variables": [\n      {\n        "name": "testName",\n        "type": "string",\n        "detail": "Name of the test",\n        "format": "kebab-case"\n      }\n    ]\n  }\n]`}
              helperText="Enter steps as JSON array. Each step must include: name, detail, command, and variables array"
              error={!!jsonError}
              sx={{ mb: 1, fontFamily: 'monospace' }}
              InputProps={{
                style: { fontFamily: 'monospace', fontSize: '14px' },
              }}
            />

            {jsonError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {jsonError}
              </Alert>
            )}

            {validationError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {validationError}
              </Alert>
            )}

            {!jsonError && !validationError && stepsJson.trim() && (
              <Alert severity="success" sx={{ mb: 2 }}>
                JSON is valid and matches Step[] interface
              </Alert>
            )}
          </Box>

          <Box className="command-create__actions">
            <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={!!jsonError || !name.trim() || !resumen.trim() || !stepsJson.trim()}>
              {isEditMode ? 'Update Command' : 'Save Command'}
            </Button>
          </Box>
        </Box>
      </Box>
    </ViewContainer>
  );
};

export default CommandCreate;
