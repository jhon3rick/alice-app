/**
 * StepsJsonEditor
 *
 * JSON editor component for command steps configuration.
 * Features Monaco Editor with syntax highlighting, validation, and error messages.
 * Displays success/error alerts based on validation state.
 */

import React, { useState, useEffect } from 'react';
import { Box, Alert, Button } from '@mui/material';
import Editor from '@monaco-editor/react';
import { validateStepsJson, STEPS_EXAMPLE } from '@utils/stepValidation';
import type { Step } from '@tstypes/dbmodules';

interface StepsJsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, steps?: Step[]) => void;
}

const StepsJsonEditor: React.FC<StepsJsonEditorProps> = ({ value, onChange, onValidationChange }) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  // Validate on value change
  useEffect(() => {
    if (!value.trim()) {
      setValidationError(null);
      setIsValid(false);
      onValidationChange?.(false);
      return;
    }

    const validation = validateStepsJson(value);
    setValidationError(validation.error);
    setIsValid(validation.isValid);
    onValidationChange?.(validation.isValid, validation.steps);
  }, [value, onValidationChange]);

  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  const handleInsertExample = () => {
    onChange(STEPS_EXAMPLE);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box component="label" sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'text.secondary' }}>
          Steps Configuration (JSON) *
        </Box>
        {!value.trim() && (
          <Button size="small" variant="outlined" onClick={handleInsertExample}>
            Insert Example
          </Button>
        )}
      </Box>

      <Box
        sx={{
          border: validationError ? '1px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)',
          borderRadius: 1,
          overflow: 'hidden',
          '&:hover': {
            borderColor: validationError ? '#d32f2f' : 'rgba(0, 0, 0, 0.87)',
          },
        }}
      >
        <Editor
          height="400px"
          defaultLanguage="json"
          value={value}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            formatOnPaste: true,
            formatOnType: true,
            wordWrap: 'on',
          }}
        />
      </Box>

      <Box sx={{ mt: 1, minHeight: '24px' }}>
        {validationError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {validationError}
          </Alert>
        )}

        {!validationError && isValid && value.trim() && (
          <Alert severity="success" sx={{ mt: 1 }}>
            JSON is valid and matches Step[] interface
          </Alert>
        )}

        {!value.trim() && (
          <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', ml: 1.5 }}>
            Enter steps as JSON array. Each step must include: name, detail, command, and variables array
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StepsJsonEditor;
