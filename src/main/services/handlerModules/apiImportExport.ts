import { ipcMain } from 'electron';
import type { Database } from 'better-sqlite3';
import * as fs from 'fs';

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

export function setupImportExportHandlers(db: Database): void {
  // Import JSON
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
                  let tagId = getOrCreateTag(db, tagName);
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
                  let tagId = getOrCreateTag(db, tagName);
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

  // Export JSON
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
          project: getCommandProjects(db, c.id).map((pid: number) => {
            const proj = db.prepare('SELECT codeindex FROM projects WHERE id = ?').get(pid) as any;
            return proj?.codeindex;
          }).filter(Boolean),
          tags: getCommandTags(db, c.id),
        })),
      };

      fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2), 'utf-8');
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
}
