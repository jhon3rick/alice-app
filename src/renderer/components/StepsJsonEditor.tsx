/**
 * StepsJsonEditor
 *
 * JSON editor component for command steps configuration.
 * Features code editor with syntax highlighting, validation, and error messages.
 * Displays success/error alerts based on validation state.
 */

import React, { useState, useEffect } from 'react';
import { Box, Alert, Button } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { validateStepsJson, STEPS_EXAMPLE } from '@utils/stepValidation';
import type { Step } from '@tstypes/dbmodules';

import './StepsJsonEditor.scss';

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

  const handleEditorChange = (value: string) => {
    onChange(value);
  };

  const handleInsertExample = () => {
    onChange(STEPS_EXAMPLE);
  };

  return (
    <Box className="steps-json-editor">
      <Box className="steps-json-editor__header">
        <Box component="label" className="steps-json-editor__label">
          Steps Configuration (JSON) *
        </Box>
        {!value.trim() && (
          <Button size="small" variant="outlined" onClick={handleInsertExample}>
            Insert Example
          </Button>
        )}
      </Box>

      <Box
        className={`steps-json-editor__editor-container ${
          validationError ? 'steps-json-editor__editor-container--error' : ''
        }`}
      >
        <CodeMirror
          value={value}
          height="400px"
          extensions={[json()]}
          onChange={handleEditorChange}
          placeholder="Enter JSON configuration for steps..."
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            dropCursor: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: true,
          }}
          className="steps-json-editor__code-editor"
        />
      </Box>

      <Box className="steps-json-editor__messages">
        {validationError && (
          <Alert severity="error" className="steps-json-editor__alert">
            {validationError}
          </Alert>
        )}

        {!validationError && isValid && value.trim() && (
          <Alert severity="success" className="steps-json-editor__alert">
            JSON is valid and matches Step[] interface
          </Alert>
        )}

        {!value.trim() && (
          <Box component="span" className="steps-json-editor__helper-text">
            Enter steps as JSON array. Each step must include: name, detail, command, and variables array
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StepsJsonEditor;
