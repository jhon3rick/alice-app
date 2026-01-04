import { contextBridge, ipcRenderer } from 'electron';
import type { Project, Tag, CommandTemplate } from './renderer/tstypes/dbmodules';

// Type definitions for IPC communication
export interface IpcResponse {
  success: boolean;
  error?: string;
  stdout?: string;
  stderr?: string;
}

export interface CommandFilters {
  projectId?: number;
  tagIds?: number[];
}

contextBridge.exposeInMainWorld('electronAPI', {
  // Projects
  getProjects: () => ipcRenderer.invoke('get-projects'),
  createProject: (project: Omit<Project, 'id'>) => ipcRenderer.invoke('create-project', project),
  updateProject: (project: Project) => ipcRenderer.invoke('update-project', project),
  deleteProject: (id: number) => ipcRenderer.invoke('delete-project', id),

  // Tags
  getTags: () => ipcRenderer.invoke('get-tags'),
  createTag: (tag: Omit<Tag, 'id'>) => ipcRenderer.invoke('create-tag', tag),
  updateTag: (tag: Tag) => ipcRenderer.invoke('update-tag', tag),
  deleteTag: (id: number) => ipcRenderer.invoke('delete-tag', id),

  // Commands
  getCommands: (filters?: CommandFilters) => ipcRenderer.invoke('get-commands', filters),
  getCommand: (id: number) => ipcRenderer.invoke('get-command', id),
  createCommand: (command: Omit<CommandTemplate, 'id'>) => ipcRenderer.invoke('create-command', command),
  updateCommand: (command: CommandTemplate) => ipcRenderer.invoke('update-command', command),
  deleteCommand: (id: number) => ipcRenderer.invoke('delete-command', id),

  // Config
  getConfig: () => ipcRenderer.invoke('get-config'),
  updateConfig: (key: string, value: string) => ipcRenderer.invoke('update-config', key, value),

  // Import/Export
  importJson: (filePath: string) => ipcRenderer.invoke('import-json', filePath),
  exportJson: (exportPath: string) => ipcRenderer.invoke('export-json', exportPath),

  // Execute command
  executeCommand: (command: string, workingDir?: string) => ipcRenderer.invoke('execute-command', command, workingDir),
});

contextBridge.exposeInMainWorld('electron', {
  // Native Electron APIs
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
});

declare global {
  interface Window {
    electronAPI: {
      getProjects: () => Promise<Project[]>;
      createProject: (project: Omit<Project, 'id'>) => Promise<Project>;
      updateProject: (project: Project) => Promise<Project>;
      deleteProject: (id: number) => Promise<IpcResponse>;
      getTags: () => Promise<Tag[]>;
      createTag: (tag: Omit<Tag, 'id'>) => Promise<Tag>;
      updateTag: (tag: Tag) => Promise<Tag>;
      deleteTag: (id: number) => Promise<IpcResponse>;
      getCommands: (filters?: CommandFilters) => Promise<CommandTemplate[]>;
      getCommand: (id: number) => Promise<CommandTemplate | null>;
      createCommand: (command: Omit<CommandTemplate, 'id'>) => Promise<CommandTemplate>;
      updateCommand: (command: CommandTemplate) => Promise<CommandTemplate>;
      deleteCommand: (id: number) => Promise<IpcResponse>;
      getConfig: () => Promise<Record<string, string>>;
      updateConfig: (key: string, value: string) => Promise<{ key: string; value: string }>;
      importJson: (filePath: string) => Promise<IpcResponse>;
      exportJson: (exportPath: string) => Promise<IpcResponse>;
      executeCommand: (command: string, workingDir?: string) => Promise<IpcResponse>;
    };
    electron: {
      openExternal: (url: string) => Promise<IpcResponse>;
      selectFolder: () => Promise<string | null>;
    };
  }
}
