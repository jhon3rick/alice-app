/**
 * CmdTemplateForm
 *
 * View component for creating and editing commands with full form.
 * Includes project selector, tags selector, name field, and JSON textarea for steps configuration.
 * Validates JSON and Step[] interface before saving.
 * Supports both create mode (/cmd-templates/new) and edit mode (/cmd-templates/:id/edit).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box, Alert } from '@mui/material';
import { Save } from '@mui/icons-material';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addCommandTemplate, modifyCommandTemplate, fetchCommandTemplate, clearCurrentCommandTemplate } from '@store/commandTemplatesSlice';

// Types
import type { Step, CommandTemplate } from '@tstypes/dbmodules';

// Custom Components
import ViewContainer from '@ui/ViewContainer';
import SelectProjects from '@components/SelectProjects';
import SelectTags from '@components/SelectTags';
import StepsJsonEditor from '@components/StepsJsonEditor';

import './CmdTemplateForm.scss';

const CmdTemplateForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const { currentCommandTemplate } = useAppSelector((state) => state.commandTemplates);

  const isEditMode = !!id;

  // Form inputs state
  const [formData, setFormData] = useState({
    name: '',
    resumen: '',
    detail: '',
    codeindex: '',
    selectedProjects: [] as string[],
    selectedTags: [] as string[],
  });

  // JSON textarea state
  const [stepsJson, setStepsJson] = useState('');
  const [isStepsValid, setIsStepsValid] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchCommandTemplate(Number(id)));
    }

    return () => {
      dispatch(clearCurrentCommandTemplate());
    };
  }, [dispatch, isEditMode, id]);

  // Load command data when editing
  useEffect(() => {
    if (isEditMode && currentCommandTemplate) {
      setFormData({
        name: currentCommandTemplate.name,
        resumen: currentCommandTemplate.resumen,
        detail: currentCommandTemplate.detail || '',
        codeindex: currentCommandTemplate.codeindex || '',
        selectedProjects: currentCommandTemplate.projects || [],
        selectedTags: currentCommandTemplate.tags || [],
      });
      setStepsJson(JSON.stringify(currentCommandTemplate.steps, null, 2));
      setIsStepsValid(true);
    }
  }, [isEditMode, currentCommandTemplate]);

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleStepsValidation = (isValid: boolean) => {
    setIsStepsValid(isValid);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      setValidationError('Command name is required');
      return;
    }

    if (!formData.resumen.trim()) {
      setValidationError('Summary is required');
      return;
    }

    if (!isStepsValid) {
      setValidationError('Please fix the errors in the steps configuration');
      return;
    }

    // Parse JSON steps
    let parsedSteps: Step[];
    try {
      parsedSteps = JSON.parse(stepsJson);
    } catch {
      setValidationError('Invalid JSON format in steps configuration');
      return;
    }

    // Create or update command object
    const commandData: CommandTemplate = {
      ...(isEditMode && currentCommandTemplate?.id ? { id: currentCommandTemplate.id } : {}),
      name: formData.name.trim(),
      resumen: formData.resumen.trim(),
      detail: formData.detail.trim(),
      codeindex: formData.codeindex.trim() || undefined,
      projects: formData.selectedProjects,
      tags: formData.selectedTags,
      steps: parsedSteps,
    };

    try {
      if (isEditMode) {
        await dispatch(modifyCommandTemplate(commandData)).unwrap();
      } else {
        await dispatch(addCommandTemplate(commandData)).unwrap();
      }
      navigate(-1);
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} command:`, error);
      setValidationError(`Failed to ${isEditMode ? 'update' : 'create'} command. Please try again.`);
    }
  };

  return (
    <ViewContainer title={isEditMode ? 'Edit Command' : 'Create Command'} className="cmd-template-form">
      <Box className="cmd-template-form__body">
        <TextField
          sx={{ mb: 2 }}
          label="Command Name"
          fullWidth
          required
          value={formData.name}
          onChange={handleInputChange('name')}
          placeholder="e.g., Run Tests"
        />

        <TextField
          sx={{ mb: 2 }}
          label="Summary"
          fullWidth
          required
          value={formData.resumen}
          onChange={handleInputChange('resumen')}
          placeholder="Brief description of the command"
          helperText="A short summary that describes what this command does"
        />

        <TextField
          sx={{ mb: 2 }}
          label="Detail"
          fullWidth
          multiline
          rows={3}
          value={formData.detail}
          onChange={handleInputChange('detail')}
          placeholder="Detailed description..."
          helperText="Optional: Detailed explanation of the command"
        />

        <TextField
          sx={{ mb: 2 }}
          label="Code Index"
          fullWidth
          value={formData.codeindex}
          onChange={handleInputChange('codeindex')}
          placeholder="e.g., CMD_001"
          helperText="Optional: Unique identifier for JSON import/export"
        />

        <Box sx={{ mb: 2 }}>
          <SelectProjects
            value={formData.selectedProjects}
            onChange={(projects) => setFormData((prev) => ({ ...prev, selectedProjects: projects }))}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <SelectTags
            value={formData.selectedTags}
            onChange={(tags) => setFormData((prev) => ({ ...prev, selectedTags: tags }))}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <StepsJsonEditor value={stepsJson} onChange={setStepsJson} onValidationChange={handleStepsValidation} />
        </Box>

        {validationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError}
          </Alert>
        )}

        <Box className="cmd-template-form__actions">
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={!formData.name.trim() || !formData.resumen.trim() || !isStepsValid}
          >
            {isEditMode ? 'Update Command' : 'Save Command'}
          </Button>
        </Box>
      </Box>
    </ViewContainer>
  );
};

export default CmdTemplateForm;
