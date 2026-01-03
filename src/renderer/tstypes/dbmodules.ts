export type VariableFormat = 'snake_case' | 'camelCase' | 'upperCamelCase' | 'kebab-case' | 'UPPER_CASE';

export type VariableType = 'string' | 'option' | 'number' | 'boolean';

export interface Variable {
  name: string;
  type: VariableType;
  detail: string;
  format?: VariableFormat;
  options?: string[];
}

export interface Step {
  name: string;
  detail: string;
  command: string;
  variables: Variable[];
}

export interface CommandTemplate {
  id?: number;
  codeindex?: string;
  name: string;
  detail: string;
  resumen: string;
  project?: number[];
  tags: string[];
  steps: Step[];
}

export interface Project {
  id?: number;
  codeindex?: string;
  name: string;
  path?: string;
}

export interface Tag {
  id?: number;
  codeindex?: string;
  name: string;
}

export interface Config {
  configPath: string;
  exportPath: string;
}

export interface VariableValue {
  name: string;
  value: string;
}

export interface CommandExecution {
  templateId: number;
  stepIndex: number;
  variables: VariableValue[];
  finalCommand: string;
}
