export type QueryId = {
  id: number;
} | null;

// Variable types and formats for validation
export type VariableFormat = 'snake_case' | 'camelCase' | 'upperCamelCase' | 'kebab-case' | 'UPPER_CASE';
export type VariableType = 'string' | 'option' | 'number' | 'boolean';

// Variable structure (used when steps JSON is parsed)
export interface Variable {
  name: string;
  type: VariableType;
  detail: string;
  format?: VariableFormat;
  options?: string[];
}

// Step structure (used when steps JSON is parsed)
export interface Step {
  name: string;
  detail: string;
  command: string;
  variables: Variable[];
}

// Command - Application level (steps is parsed array)
export interface Command {
  id?: number;
  codeindex?: string;
  name: string;
  detail: string;
  resumen: string;
  projects: string[];
  tags: string[];
  steps: Step[];
}

// StoredCommand - Database level (steps is JSON string, no project/tags)
export interface StoredCommand extends Omit<Command, 'id' | 'steps' | 'project' | 'tags'> {
  id: number;
  steps: string; // JSON string in DB
}

export interface Project {
  id?: number;
  codeindex?: string;
  name: string;
  path?: string;
}

export interface StoredProject extends Omit<Project, 'id'> {
  id: number;
}

export interface Tag {
  id?: number;
  codeindex?: string;
  name: string;
}

export interface StoredTag extends Omit<Tag, 'id'> {
  id: number;
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
