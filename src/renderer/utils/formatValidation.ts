import { VariableFormat } from '@types/index';

export function applyFormat(value: string, format?: VariableFormat): string {
  if (!format) return value;

  switch (format) {
    case 'snake_case':
      return toSnakeCase(value);
    case 'camelCase':
      return toCamelCase(value);
    case 'upperCamelCase':
      return toUpperCamelCase(value);
    case 'kebab-case':
      return toKebabCase(value);
    case 'UPPER_CASE':
      return toUpperCase(value);
    default:
      return value;
  }
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .toLowerCase()
    .replace(/^_/, '');
}

function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

function toUpperCamelCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase()
    .replace(/^-/, '');
}

function toUpperCase(str: string): string {
  return toSnakeCase(str).toUpperCase();
}

export function validateFormat(value: string, format?: VariableFormat): boolean {
  if (!format) return true;

  switch (format) {
    case 'snake_case':
      return /^[a-z][a-z0-9_]*$/.test(value);
    case 'camelCase':
      return /^[a-z][a-zA-Z0-9]*$/.test(value);
    case 'upperCamelCase':
      return /^[A-Z][a-zA-Z0-9]*$/.test(value);
    case 'kebab-case':
      return /^[a-z][a-z0-9-]*$/.test(value);
    case 'UPPER_CASE':
      return /^[A-Z][A-Z0-9_]*$/.test(value);
    default:
      return true;
  }
}
