import { ipcMain } from 'electron';
import type { Database } from 'better-sqlite3';

export function setupProjectsHandlers(db: Database): void {
  // Get all projects
  ipcMain.handle('get-projects', () => {
    const stmt = db.prepare('SELECT * FROM projects ORDER BY name ASC');
    return stmt.all();
  });

  // Create project
  ipcMain.handle('create-project', (_event, project: { codeindex?: string; name: string; path?: string }) => {
    const stmt = db.prepare('INSERT INTO projects (codeindex, name, path) VALUES (?, ?, ?)');
    const result = stmt.run(project.codeindex || null, project.name, project.path || null);
    return { id: result.lastInsertRowid, ...project };
  });

  // Update project
  ipcMain.handle('update-project', (_event, project: { id: number; codeindex?: string; name: string; path?: string }) => {
    const stmt = db.prepare('UPDATE projects SET codeindex = ?, name = ?, path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(project.codeindex || null, project.name, project.path || null, project.id);
    return project;
  });

  // Delete project
  ipcMain.handle('delete-project', (_event, id: number) => {
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run(id);
    return { success: true };
  });
}
