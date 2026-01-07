import { ipcMain, BrowserWindow } from 'electron';
import * as pty from 'node-pty';
import * as os from 'os';

interface TerminalSession {
  ptyProcess: pty.IPty;
  window: BrowserWindow;
}

// Store active terminal sessions
const terminalSessions = new Map<string, TerminalSession>();

export function setupTerminalHandlers(): void {
  // Create a new terminal session
  ipcMain.handle('create-terminal', (event, cwd: string, cols: number, rows: number): string => {
    const shell = os.platform() === 'win32' ? 'powershell.exe' : process.env.SHELL || '/bin/bash';
    const terminalId = `terminal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Use home directory if cwd is empty or undefined
      const workingDir = cwd && cwd.trim() !== '' ? cwd : os.homedir();

      const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: cols || 80,
        rows: rows || 24,
        cwd: workingDir,
        env: process.env as { [key: string]: string },
      });

      const window = BrowserWindow.fromWebContents(event.sender);
      if (!window) {
        throw new Error('Window not found');
      }

      terminalSessions.set(terminalId, {
        ptyProcess,
        window,
      });

      // Send data from PTY to renderer
      ptyProcess.onData((data) => {
        window.webContents.send(`terminal-data-${terminalId}`, data);
      });

      // Handle PTY exit
      ptyProcess.onExit(({ exitCode, signal }) => {
        console.log(`Terminal ${terminalId} exited with code ${exitCode}, signal ${signal}`);
        terminalSessions.delete(terminalId);
      });

      return terminalId;
    } catch (error) {
      console.error('Error creating terminal:', error);
      throw error;
    }
  });

  // Write data to terminal
  ipcMain.handle('write-to-terminal', (_event, terminalId: string, data: string): void => {
    const session = terminalSessions.get(terminalId);
    if (session) {
      session.ptyProcess.write(data);
    }
  });

  // Resize terminal
  ipcMain.handle('resize-terminal', (_event, terminalId: string, cols: number, rows: number): void => {
    const session = terminalSessions.get(terminalId);
    if (session) {
      session.ptyProcess.resize(cols, rows);
    }
  });

  // Close terminal
  ipcMain.handle('close-terminal', (_event, terminalId: string): void => {
    const session = terminalSessions.get(terminalId);
    if (session) {
      session.ptyProcess.kill();
      terminalSessions.delete(terminalId);
    }
  });
}

// Cleanup all terminals when app is closing
export function cleanupTerminals(): void {
  terminalSessions.forEach((session) => {
    session.ptyProcess.kill();
  });
  terminalSessions.clear();
}
