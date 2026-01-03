import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Projects
  getProjects: () => ipcRenderer.invoke('get-projects'),
  createProject: (project: any) => ipcRenderer.invoke('create-project', project),
  updateProject: (project: any) => ipcRenderer.invoke('update-project', project),
  deleteProject: (id: number) => ipcRenderer.invoke('delete-project', id),

  // Tags
  getTags: () => ipcRenderer.invoke('get-tags'),
  createTag: (tag: any) => ipcRenderer.invoke('create-tag', tag),
  updateTag: (tag: any) => ipcRenderer.invoke('update-tag', tag),
  deleteTag: (id: number) => ipcRenderer.invoke('delete-tag', id),

  // Commands
  getCommands: (filters?: any) => ipcRenderer.invoke('get-commands', filters),
  getCommand: (id: number) => ipcRenderer.invoke('get-command', id),
  createCommand: (command: any) => ipcRenderer.invoke('create-command', command),
  updateCommand: (command: any) => ipcRenderer.invoke('update-command', command),
  deleteCommand: (id: number) => ipcRenderer.invoke('delete-command', id),

  // Config
  getConfig: () => ipcRenderer.invoke('get-config'),
  updateConfig: (key: string, value: string) => ipcRenderer.invoke('update-config', key, value),

  // Config Show Finder
  selectFolder: () => ipcRenderer.invoke("select-folder"),

  // Import/Export
  importJson: (filePath: string) => ipcRenderer.invoke('import-json', filePath),
  exportJson: (exportPath: string) => ipcRenderer.invoke('export-json', exportPath),

  // Execute command
  executeCommand: (command: string, workingDir?: string) => ipcRenderer.invoke('execute-command', command, workingDir),
});

declare global {
  interface Window {
    electronAPI: {
      getProjects: () => Promise<any[]>;
      createProject: (project: any) => Promise<any>;
      updateProject: (project: any) => Promise<any>;
      deleteProject: (id: number) => Promise<any>;
      getTags: () => Promise<any[]>;
      createTag: (tag: any) => Promise<any>;
      updateTag: (tag: any) => Promise<any>;
      deleteTag: (id: number) => Promise<any>;
      getCommands: (filters?: any) => Promise<any[]>;
      getCommand: (id: number) => Promise<any>;
      createCommand: (command: any) => Promise<any>;
      updateCommand: (command: any) => Promise<any>;
      deleteCommand: (id: number) => Promise<any>;
      getConfig: () => Promise<Record<string, string>>;
      updateConfig: (key: string, value: string) => Promise<any>;
      selectFolder: () => Promise<any>;
      importJson: (filePath: string) => Promise<any>;
      exportJson: (exportPath: string) => Promise<any>;
      executeCommand: (command: string, workingDir?: string) => Promise<any>;
    };
  }
}
