import { ColumnType, Generated, Selectable, Insertable, Updateable } from 'kysely';

// Database table schemas
export interface ProjectsTable {
  id: Generated<number>;
  codeindex: string;
  name: string;
  path: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}

export interface TagsTable {
  id: Generated<number>;
  codeindex: string;
  name: string;
  icon: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}

export interface CommandTemplatesTable {
  id: Generated<number>;
  codeindex: string | null;
  name: string;
  detail: string;
  resumen: string;
  steps: string; // JSON string
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}

export interface CommandProjectsTable {
  command_id: number;
  project_id: number;
}

export interface CommandTagsTable {
  command_id: number;
  tag_id: number;
}

export interface ConfigTable {
  key: string;
  value: string;
  updated_at: ColumnType<Date, string | undefined, string>;
}

// Database interface with all tables
export interface Database {
  projects: ProjectsTable;
  tags: TagsTable;
  command_templates: CommandTemplatesTable;
  command_projects: CommandProjectsTable;
  command_tags: CommandTagsTable;
  config: ConfigTable;
}

// Helper types for CRUD operations
export type Project = Selectable<ProjectsTable>;
export type NewProject = Insertable<ProjectsTable>;
export type ProjectUpdate = Updateable<ProjectsTable>;

export type Tag = Selectable<TagsTable>;
export type NewTag = Insertable<TagsTable>;
export type TagUpdate = Updateable<TagsTable>;

export type CommandTemplate = Selectable<CommandTemplatesTable>;
export type NewCommandTemplate = Insertable<CommandTemplatesTable>;
export type CommandTemplateUpdate = Updateable<CommandTemplatesTable>;

export type CommandProject = Selectable<CommandProjectsTable>;
export type NewCommandProject = Insertable<CommandProjectsTable>;

export type CommandTag = Selectable<CommandTagsTable>;
export type NewCommandTag = Insertable<CommandTagsTable>;

export type Config = Selectable<ConfigTable>;
export type NewConfig = Insertable<ConfigTable>;
export type ConfigUpdate = Updateable<ConfigTable>;
