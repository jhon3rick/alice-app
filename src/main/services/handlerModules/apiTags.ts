import { ipcMain } from 'electron';
import type { Database } from 'better-sqlite3';

export function setupTagsHandlers(db: Database): void {
  // Get all tags
  ipcMain.handle('get-tags', () => {
    const stmt = db.prepare('SELECT * FROM tags ORDER BY name ASC');
    return stmt.all();
  });

  // Create tag
  ipcMain.handle('create-tag', (_event, tag: { codeindex?: string; name: string }) => {
    const stmt = db.prepare('INSERT INTO tags (codeindex, name) VALUES (?, ?)');
    const result = stmt.run(tag.codeindex || null, tag.name);
    return { id: result.lastInsertRowid, ...tag };
  });

  // Update tag
  ipcMain.handle('update-tag', (_event, tag: { id: number; codeindex?: string; name: string }) => {
    const stmt = db.prepare('UPDATE tags SET codeindex = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(tag.codeindex || null, tag.name, tag.id);
    return tag;
  });

  // Delete tag
  ipcMain.handle('delete-tag', (_event, id: number) => {
    const stmt = db.prepare('DELETE FROM tags WHERE id = ?');
    stmt.run(id);
    return { success: true };
  });
}
