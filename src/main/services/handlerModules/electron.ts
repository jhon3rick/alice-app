import { ipcMain, shell, dialog } from 'electron';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function setupElectronHandlers(): void {
  // Select folder dialog
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Selecciona una carpeta',
      properties: ['openDirectory'],
    });

    if (result.canceled) {
      return null;
    }

    return result.filePaths[0];
  });

  // Select file dialog
  ipcMain.handle('select-file', async (_event, filters?: { name: string; extensions: string[] }[]) => {
    const result = await dialog.showOpenDialog({
      title: 'Selecciona un archivo',
      properties: ['openFile'],
      filters: filters || [],
    });

    if (result.canceled) {
      return null;
    }

    return result.filePaths[0];
  });

  // Open external URL in default browser
  ipcMain.handle('open-external', async (_event, url: string) => {
    try {
      await shell.openExternal(url);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  });

  // Execute command
  ipcMain.handle('execute-command', async (_event, command: string, workingDir?: string) => {
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: workingDir || process.cwd(),
        encoding: 'utf-8',
      });
      return { success: true, stdout, stderr };
    } catch (error) {
      const err = error as { message: string; stdout?: string; stderr?: string };
      return { success: false, error: err.message, stdout: err.stdout, stderr: err.stderr };
    }
  });
}
