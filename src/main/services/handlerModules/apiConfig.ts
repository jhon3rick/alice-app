import { ipcMain } from 'electron';
import type { Database } from 'better-sqlite3';

export function setupConfigHandlers(db: Database): void {
  // Get config
  ipcMain.handle('get-config', () => {
    const stmt = db.prepare('SELECT * FROM config');
    const rows = stmt.all() as { key: string; value: string }[];
    const config: Record<string, string> = {};
    rows.forEach(row => {
      config[row.key] = row.value;
    });
    return config;
  });

  // Update config
  ipcMain.handle('update-config', (_event, key: string, value: string) => {
    const stmt = db.prepare('INSERT OR REPLACE INTO config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
    stmt.run(key, value);
    return { key, value };
  });
}
