import { ipcMain, shell } from 'electron';
import { databaseService } from '../database/Database';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function setupIpcHandlers(): void {
  const db = databaseService.getDatabase();
  if (!db) return;

  // Projects
  ipcMain.handle('get-projects', () => {
    const stmt = db.prepare('SELECT * FROM projects ORDER BY name ASC');
    return stmt.all();
  });

  ipcMain.handle('create-project', (_event, project: { codeindex?: string; name: string; path?: string }) => {
    const stmt = db.prepare('INSERT INTO projects (codeindex, name, path) VALUES (?, ?, ?)');
    const result = stmt.run(project.codeindex || null, project.name, project.path || null);
    return { id: result.lastInsertRowid, ...project };
  });

  ipcMain.handle('update-project', (_event, project: { id: number; codeindex?: string; name: string; path?: string }) => {
    const stmt = db.prepare('UPDATE projects SET codeindex = ?, name = ?, path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(project.codeindex || null, project.name, project.path || null, project.id);
    return project;
  });

  ipcMain.handle('delete-project', (_event, id: number) => {
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run(id);
    return { success: true };
  });

  // Tags
  ipcMain.handle('get-tags', () => {
    const stmt = db.prepare('SELECT * FROM tags ORDER BY name ASC');
    return stmt.all();
  });

  ipcMain.handle('create-tag', (_event, tag: { codeindex?: string; name: string }) => {
    const stmt = db.prepare('INSERT INTO tags (codeindex, name) VALUES (?, ?)');
    const result = stmt.run(tag.codeindex || null, tag.name);
    return { id: result.lastInsertRowid, ...tag };
  });

  ipcMain.handle('update-tag', (_event, tag: { id: number; codeindex?: string; name: string }) => {
    const stmt = db.prepare('UPDATE tags SET codeindex = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(tag.codeindex || null, tag.name, tag.id);
    return tag;
  });

  ipcMain.handle('delete-tag', (_event, id: number) => {
    const stmt = db.prepare('DELETE FROM tags WHERE id = ?');
    stmt.run(id);
    return { success: true };
  });

  // Commands
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
      project: getCommandProjects(cmd.id),
      tags: getCommandTags(cmd.id),
    }));
  });

  ipcMain.handle('get-command', (_event, id: number) => {
    const stmt = db.prepare('SELECT * FROM command_templates WHERE id = ?');
    const cmd: any = stmt.get(id);
    if (!cmd) return null;

    return {
      ...cmd,
      steps: JSON.parse(cmd.steps),
      project: getCommandProjects(cmd.id),
      tags: getCommandTags(cmd.id),
    };
  });

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
        let tagId = getOrCreateTag(tagName);
        tagStmt.run(commandId, tagId);
      }
    }

    return { id: commandId, ...command };
  });

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
        let tagId = getOrCreateTag(tagName);
        tagStmt.run(id, tagId);
      }
    }

    return command;
  });

  ipcMain.handle('delete-command', (_event, id: number) => {
    const stmt = db.prepare('DELETE FROM command_templates WHERE id = ?');
    stmt.run(id);
    return { success: true };
  });

  // Config
  ipcMain.handle('get-config', () => {
    const stmt = db.prepare('SELECT * FROM config');
    const rows = stmt.all() as { key: string; value: string }[];
    const config: Record<string, string> = {};
    rows.forEach(row => {
      config[row.key] = row.value;
    });
    return config;
  });

  ipcMain.handle('update-config', (_event, key: string, value: string) => {
    const stmt = db.prepare('INSERT OR REPLACE INTO config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
    stmt.run(key, value);
    return { key, value };
  });

  // Import/Export JSON
  ipcMain.handle('import-json', (_event, filePath: string) => {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(data);

      if (json.projects) {
        for (const project of json.projects) {
          if (project.codeindex) {
            const existing = db.prepare('SELECT id FROM projects WHERE codeindex = ?').get(project.codeindex) as any;
            if (existing) {
              db.prepare('UPDATE projects SET name = ?, path = ?, updated_at = CURRENT_TIMESTAMP WHERE codeindex = ?')
                .run(project.name, project.path || null, project.codeindex);
            } else {
              db.prepare('INSERT INTO projects (codeindex, name, path) VALUES (?, ?, ?)')
                .run(project.codeindex, project.name, project.path || null);
            }
          }
        }
      }

      if (json.commands) {
        for (const command of json.commands) {
          const { codeindex, name, detail, resumen, steps, project, tags } = command;

          if (codeindex) {
            const existing = db.prepare('SELECT id FROM command_templates WHERE codeindex = ?').get(codeindex) as any;
            if (existing) {
              db.prepare('UPDATE command_templates SET name = ?, detail = ?, resumen = ?, steps = ?, updated_at = CURRENT_TIMESTAMP WHERE codeindex = ?')
                .run(name, detail, resumen, JSON.stringify(steps), codeindex);

              const commandId = existing.id;
              db.prepare('DELETE FROM command_projects WHERE command_id = ?').run(commandId);
              db.prepare('DELETE FROM command_tags WHERE command_id = ?').run(commandId);

              if (project && project.length > 0) {
                const projectStmt = db.prepare('INSERT INTO command_projects (command_id, project_id) VALUES (?, ?)');
                for (const projectCodeindex of project) {
                  const proj = db.prepare('SELECT id FROM projects WHERE codeindex = ?').get(projectCodeindex) as any;
                  if (proj) projectStmt.run(commandId, proj.id);
                }
              }

              if (tags && tags.length > 0) {
                const tagStmt = db.prepare('INSERT INTO command_tags (command_id, tag_id) VALUES (?, ?)');
                for (const tagName of tags) {
                  let tagId = getOrCreateTag(tagName);
                  tagStmt.run(commandId, tagId);
                }
              }
            } else {
              const result = db.prepare('INSERT INTO command_templates (codeindex, name, detail, resumen, steps) VALUES (?, ?, ?, ?, ?)')
                .run(codeindex, name, detail, resumen, JSON.stringify(steps));
              const commandId = result.lastInsertRowid as number;

              if (project && project.length > 0) {
                const projectStmt = db.prepare('INSERT INTO command_projects (command_id, project_id) VALUES (?, ?)');
                for (const projectCodeindex of project) {
                  const proj = db.prepare('SELECT id FROM projects WHERE codeindex = ?').get(projectCodeindex) as any;
                  if (proj) projectStmt.run(commandId, proj.id);
                }
              }

              if (tags && tags.length > 0) {
                const tagStmt = db.prepare('INSERT INTO command_tags (command_id, tag_id) VALUES (?, ?)');
                for (const tagName of tags) {
                  let tagId = getOrCreateTag(tagName);
                  tagStmt.run(commandId, tagId);
                }
              }
            }
          }
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('export-json', (_event, exportPath: string) => {
    try {
      const projects = db.prepare('SELECT * FROM projects').all();
      const tags = db.prepare('SELECT * FROM tags').all();
      const commands = db.prepare('SELECT * FROM command_templates').all();

      const exportData = {
        projects: projects.map((p: any) => ({
          codeindex: p.codeindex,
          name: p.name,
          path: p.path,
        })),
        commands: commands.map((c: any) => ({
          codeindex: c.codeindex,
          name: c.name,
          detail: c.detail,
          resumen: c.resumen,
          steps: JSON.parse(c.steps),
          project: getCommandProjects(c.id).map((pid: number) => {
            const proj = db.prepare('SELECT codeindex FROM projects WHERE id = ?').get(pid) as any;
            return proj?.codeindex;
          }).filter(Boolean),
          tags: getCommandTags(c.id),
        })),
      };

      fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2), 'utf-8');
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
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

  // Helper functions
  function getCommandProjects(commandId: number): number[] {
    const stmt = db.prepare('SELECT project_id FROM command_projects WHERE command_id = ?');
    const rows = stmt.all(commandId) as { project_id: number }[];
    return rows.map(r => r.project_id);
  }

  function getCommandTags(commandId: number): string[] {
    const stmt = db.prepare(`
      SELECT t.name FROM tags t
      JOIN command_tags ct ON t.id = ct.tag_id
      WHERE ct.command_id = ?
    `);
    const rows = stmt.all(commandId) as { name: string }[];
    return rows.map(r => r.name);
  }

  function getOrCreateTag(tagName: string): number {
    let tag = db.prepare('SELECT id FROM tags WHERE name = ?').get(tagName) as any;
    if (tag) return tag.id;

    const result = db.prepare('INSERT INTO tags (name) VALUES (?)').run(tagName);
    return result.lastInsertRowid as number;
  }
}
