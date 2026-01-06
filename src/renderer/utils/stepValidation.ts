/**
 * Step Validation Utilities
 *
 * Utilities for validating JSON and Step[] interface.
 * Provides detailed error messages for debugging.
 */

import type { Step } from '@tstypes/dbmodules';

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validates JSON syntax
 */
export const validateJson = (jsonString: string): ValidationResult => {
  if (!jsonString.trim()) {
    return { isValid: false, error: null };
  }

  try {
    JSON.parse(jsonString);
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { isValid: false, error: `Invalid JSON: ${error.message}` };
    }
    return { isValid: false, error: 'Invalid JSON syntax' };
  }
};

/**
 * Validates that parsed JSON matches Step[] interface
 */
export const validateStepsInterface = (steps: Step[]): ValidationResult => {
  if (!Array.isArray(steps)) {
    return { isValid: false, error: 'Steps must be an array' };
  }

  if (steps.length === 0) {
    return { isValid: false, error: 'Steps array cannot be empty' };
  }

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    if (typeof step !== 'object' || step === null) {
      return { isValid: false, error: `Step ${i + 1}: Must be an object` };
    }

    if (typeof step.name !== 'string' || !step.name.trim()) {
      return { isValid: false, error: `Step ${i + 1}: Missing or invalid 'name' (must be non-empty string)` };
    }

    if (typeof step.detail !== 'string') {
      return { isValid: false, error: `Step ${i + 1}: Missing or invalid 'detail' (must be string)` };
    }

    if (typeof step.command !== 'string' || !step.command.trim()) {
      return { isValid: false, error: `Step ${i + 1}: Missing or invalid 'command' (must be non-empty string)` };
    }

    if (!Array.isArray(step.variables)) {
      return { isValid: false, error: `Step ${i + 1}: Missing or invalid 'variables' (must be array)` };
    }

    // Validate each variable
    for (let j = 0; j < step.variables.length; j++) {
      const variable = step.variables[j];

      if (typeof variable !== 'object' || variable === null) {
        return { isValid: false, error: `Step ${i + 1}, Variable ${j + 1}: Must be an object` };
      }

      if (typeof variable.name !== 'string' || !variable.name.trim()) {
        return { isValid: false, error: `Step ${i + 1}, Variable ${j + 1}: Missing or invalid 'name' (must be non-empty string)` };
      }

      const validTypes = ['string', 'option', 'number', 'boolean'];
      if (!validTypes.includes(variable.type)) {
        return {
          isValid: false,
          error: `Step ${i + 1}, Variable ${j + 1}: Invalid 'type' (must be one of: ${validTypes.join(', ')})`,
        };
      }

      if (typeof variable.detail !== 'string') {
        return { isValid: false, error: `Step ${i + 1}, Variable ${j + 1}: Missing or invalid 'detail' (must be string)` };
      }

      // Optional format validation
      if (variable.format !== undefined) {
        const validFormats = ['snake_case', 'camelCase', 'upperCamelCase', 'kebab-case', 'UPPER_CASE'];
        if (!validFormats.includes(variable.format)) {
          return {
            isValid: false,
            error: `Step ${i + 1}, Variable ${j + 1}: Invalid 'format' (must be one of: ${validFormats.join(', ')})`,
          };
        }
      }

      // Options validation for 'option' type
      if (variable.type === 'option') {
        if (!Array.isArray(variable.options) || variable.options.length === 0) {
          return {
            isValid: false,
            error: `Step ${i + 1}, Variable ${j + 1}: 'options' is required and must be non-empty array for type 'option'`,
          };
        }

        if (!variable.options.every((opt: string) => typeof opt === 'string')) {
          return { isValid: false, error: `Step ${i + 1}, Variable ${j + 1}: All 'options' must be strings` };
        }
      }
    }
  }

  return { isValid: true, error: null };
};

/**
 * Validates both JSON syntax and Step[] interface
 */
export const validateStepsJson = (jsonString: string): { isValid: boolean; error: string | null; steps?: Step[] } => {
  // Validate JSON syntax
  const jsonValidation = validateJson(jsonString);
  if (!jsonValidation.isValid) {
    return { isValid: false, error: jsonValidation.error };
  }

  if (!jsonString.trim()) {
    return { isValid: false, error: 'Steps configuration is required' };
  }

  // Parse JSON
  let parsedSteps: Step[];
  try {
    parsedSteps = JSON.parse(jsonString);
  } catch {
    return { isValid: false, error: 'Failed to parse JSON' };
  }

  // Validate Step[] interface
  const interfaceValidation = validateStepsInterface(parsedSteps);
  if (!interfaceValidation.isValid) {
    return { isValid: false, error: interfaceValidation.error };
  }

  return { isValid: true, error: null, steps: parsedSteps as Step[] };
};

/**
 * Example Step configuration for placeholder
 */
export const STEPS_EXAMPLE = `[
  {
    "name": "Step 1",
    "detail": "Description of what this step does",
    "command": "npm test {{testName}}",
    "variables": [
      {
        "name": "testName",
        "type": "string",
        "detail": "Name of the test to run",
        "format": "kebab-case"
      }
    ]
  },
  {
    "name": "Step 2",
    "detail": "Another step with options",
    "command": "git commit -m \\"{{message}}\\" {{flag}}",
    "variables": [
      {
        "name": "message",
        "type": "string",
        "detail": "Commit message"
      },
      {
        "name": "flag",
        "type": "option",
        "detail": "Additional flags",
        "options": ["--amend", "--no-verify", ""]
      }
    ]
  }
]`;
