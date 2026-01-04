import { ipcMain } from 'electron';
import type { Database } from 'better-sqlite3';

// Helper functions
function getCommandProjects(db: Database, commandId: number): number[] {
  const stmt = db.prepare('SELECT project_id FROM command_projects WHERE command_id = ?');
  const rows = stmt.all(commandId) as { project_id: number }[];
  return rows.map(r => r.project_id);
}

function getCommandTags(db: Database, commandId: number): string[] {
  const stmt = db.prepare(`
    SELECT t.name FROM tags t
    JOIN command_tags ct ON t.id = ct.tag_id
    WHERE ct.command_id = ?
  `);
  const rows = stmt.all(commandId) as { name: string }[];
  return rows.map(r => r.name);
}

function getOrCreateTag(db: Database, tagName: string): number {
  let tag = db.prepare('SELECT id FROM tags WHERE name = ?').get(tagName) as any;
  if (tag) return tag.id;

  const result = db.prepare('INSERT INTO tags (name) VALUES (?)').run(tagName);
  return result.lastInsertRowid as number;
}

export function setupCommandsHandlers(db: Database): void {
  // Get commands with filters
  ipcMain.handle('get-commands', (_event, filters?: { projectId?: number; tagIds?: number[] }) => {
    let query = `
      SELECT DISTINCT ct.* FROM command_templates ct
    `;
    const params: any[] = [];

    if (filters?.projectId) {
      query += `
        LEFT JOIN command_projects cp ON ct.id = cp.command_id
        WHERE (cp.project_id = ? OR cp.project_id IS NULL)
      `;
      params.push(filters.projectId);
    }

    if (filters?.tagIds && filters.tagIds.length > 0) {
      const tagCondition = filters?.projectId ? 'AND' : 'WHERE';
      query += `
        ${tagCondition} ct.id IN (
          SELECT command_id FROM command_tags WHERE tag_id IN (${filters.tagIds.map(() => '?').join(',')})
        )
      `;
      params.push(...filters.tagIds);
    }

    query += ' ORDER BY ct.name ASC';

    const stmt = db.prepare(query);
    const commands = stmt.all(...params);

    return commands.map((cmd: any) => ({
      ...cmd,
      steps: JSON.parse(cmd.steps),
      project: getCommandProjects(db, cmd.id),
      tags: getCommandTags(db, cmd.id),
    }));
  });

  // Get single command
  ipcMain.handle('get-command', (_event, id: number) => {
    const stmt = db.prepare('SELECT * FROM command_templates WHERE id = ?');
    const cmd: any = stmt.get(id);
    if (!cmd) return null;

    return {
      ...cmd,
      steps: JSON.parse(cmd.steps),
      project: getCommandProjects(db, cmd.id),
      tags: getCommandTags(db, cmd.id),
    };
  });

  // Create command
  ipcMain.handle('create-command', (_event, command: any) => {
    const { codeindex, name, detail, resumen, steps, project, tags } = command;

    const stmt = db.prepare('INSERT INTO command_templates (codeindex, name, detail, resumen, steps) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(codeindex || null, name, detail, resumen, JSON.stringify(steps));
    const commandId = result.lastInsertRowid as number;

    if (project && project.length > 0) {
      const projectStmt = db.prepare('INSERT INTO command_projects (command_id, project_id) VALUES (?, ?)');
      for (const projectId of project) {
        projectStmt.run(commandId, projectId);
      }
    }

    if (tags && tags.length > 0) {
      const tagStmt = db.prepare('INSERT INTO command_tags (command_id, tag_id) VALUES (?, ?)');
      for (const tagName of tags) {
        let tagId = getOrCreateTag(db, tagName);
        tagStmt.run(commandId, tagId);
      }
    }

    return { id: commandId, ...command };
  });

  // Update command
  ipcMain.handle('update-command', (_event, command: any) => {
    const { id, codeindex, name, detail, resumen, steps, project, tags } = command;

    const stmt = db.prepare('UPDATE command_templates SET codeindex = ?, name = ?, detail = ?, resumen = ?, steps = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(codeindex || null, name, detail, resumen, JSON.stringify(steps), id);

    db.prepare('DELETE FROM command_projects WHERE command_id = ?').run(id);
    if (project && project.length > 0) {
      const projectStmt = db.prepare('INSERT INTO command_projects (command_id, project_id) VALUES (?, ?)');
      for (const projectId of project) {
        projectStmt.run(id, projectId);
      }
    }

    db.prepare('DELETE FROM command_tags WHERE command_id = ?').run(id);
    if (tags && tags.length > 0) {
      const tagStmt = db.prepare('INSERT INTO command_tags (command_id, tag_id) VALUES (?, ?)');
      for (const tagName of tags) {
        let tagId = getOrCreateTag(db, tagName);
        tagStmt.run(id, tagId);
      }
    }

    return command;
  });

  // Delete command
  ipcMain.handle('delete-command', (_event, id: number) => {
    const stmt = db.prepare('DELETE FROM command_templates WHERE id = ?');
    stmt.run(id);
    return { success: true };
  });
}
