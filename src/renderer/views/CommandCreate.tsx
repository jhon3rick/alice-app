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
import StepsJsonEditor from '@components/StepsJsonEditor';

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
  const [validatedSteps, setValidatedSteps] = useState<Step[] | undefined>(undefined);
  const [isStepsValid, setIsStepsValid] = useState(false);
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

  const handleStepsValidation = (isValid: boolean, steps?: Step[]) => {
    setIsStepsValid(isValid);
    setValidatedSteps(steps);
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

    if (!isStepsValid || !validatedSteps) {
      setValidationError('Please fix the errors in the steps configuration');
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
      steps: validatedSteps,
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

          <Box sx={{ mb: 2 }}>
            <StepsJsonEditor
              value={stepsJson}
              onChange={setStepsJson}
              onValidationChange={handleStepsValidation}
            />
          </Box>

          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}

          <Box className="command-create__actions">
            <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={!name.trim() || !resumen.trim() || !isStepsValid}>
              {isEditMode ? 'Update Command' : 'Save Command'}
            </Button>
          </Box>
        </Box>
      </Box>
    </ViewContainer>
  );
};

export default CommandCreate;
