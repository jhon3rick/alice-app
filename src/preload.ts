import { contextBridge, ipcRenderer } from 'electron';
import type { Project, Tag, CommandTemplate } from './renderer/tstypes/dbmodules';

// Type definitions for IPC communication
export interface IpcResponse {
  success: boolean;
  error?: string;
  stdout?: string;
  stderr?: string;
}

export interface CommandTemplateFilters {
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

  // Command Templates
  getCommandTemplates: (filters?: CommandTemplateFilters) => ipcRenderer.invoke('get-command-templates', filters),
  getCommandTemplate: (id: number) => ipcRenderer.invoke('get-command-template', id),
  createCommandTemplate: (command: Omit<CommandTemplate, 'id'>) => ipcRenderer.invoke('create-command-template', command),
  updateCommandTemplate: (command: CommandTemplate) => ipcRenderer.invoke('update-command-template', command),
  deleteCommandTemplate: (id: number) => ipcRenderer.invoke('delete-command-template', id),

  // Config
  getConfig: () => ipcRenderer.invoke('get-config'),
  updateConfig: (key: string, value: string) => ipcRenderer.invoke('update-config', key, value),

  // Import/Export
  importJson: (filePath: string) => ipcRenderer.invoke('import-json', filePath),
  exportJson: (exportPath: string) => ipcRenderer.invoke('export-json', exportPath),

  // Execute command
  executeCommand: (command: string, workingDir?: string) => ipcRenderer.invoke('execute-command', command, workingDir),

  // Terminal
  createTerminal: (cwd: string, cols: number, rows: number) => ipcRenderer.invoke('create-terminal', cwd, cols, rows),
  writeToTerminal: (terminalId: string, data: string) => ipcRenderer.invoke('write-to-terminal', terminalId, data),
  resizeTerminal: (terminalId: string, cols: number, rows: number) => ipcRenderer.invoke('resize-terminal', terminalId, cols, rows),
  closeTerminal: (terminalId: string) => ipcRenderer.invoke('close-terminal', terminalId),
  onTerminalData: (terminalId: string, callback: (data: string) => void) => {
    const channel = `terminal-data-${terminalId}`;
    ipcRenderer.on(channel, (_event, data) => callback(data));
  },
});

contextBridge.exposeInMainWorld('electron', {
  // Native Electron APIs
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectFile: (filters?: { name: string; extensions: string[] }[]) => ipcRenderer.invoke('select-file', filters),
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
      getCommandTemplates: (filters?: CommandTemplateFilters) => Promise<CommandTemplate[]>;
      getCommandTemplate: (id: number) => Promise<CommandTemplate | null>;
      createCommandTemplate: (command: Omit<CommandTemplate, 'id'>) => Promise<CommandTemplate>;
      updateCommandTemplate: (command: CommandTemplate) => Promise<CommandTemplate>;
      deleteCommandTemplate: (id: number) => Promise<IpcResponse>;
      getConfig: () => Promise<Record<string, string>>;
      updateConfig: (key: string, value: string) => Promise<{ key: string; value: string }>;
      importJson: (filePath: string) => Promise<IpcResponse>;
      exportJson: (exportPath: string) => Promise<IpcResponse>;
      executeCommand: (command: string, workingDir?: string) => Promise<IpcResponse>;
      createTerminal: (cwd: string, cols: number, rows: number) => Promise<string>;
      writeToTerminal: (terminalId: string, data: string) => Promise<void>;
      resizeTerminal: (terminalId: string, cols: number, rows: number) => Promise<void>;
      closeTerminal: (terminalId: string) => Promise<void>;
      onTerminalData: (terminalId: string, callback: (data: string) => void) => void;
    };
    electron: {
      openExternal: (url: string) => Promise<IpcResponse>;
      selectFolder: () => Promise<string | null>;
      selectFile: (filters?: { name: string; extensions: string[] }[]) => Promise<string | null>;
    };
  }
}
