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

  // Open external URL in default browser
  ipcMain.handle('open-external', async (_event, url: string) => {
    try {
      await shell.openExternal(url);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
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
    } catch (error: any) {
      return { success: false, error: error.message, stdout: error.stdout, stderr: error.stderr };
    }
  });
}
