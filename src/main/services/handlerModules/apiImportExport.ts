import { ipcMain } from 'electron';
import type { Kysely } from 'kysely';
import * as fs from 'fs';

import { Step } from '@tstypes/dbmodules';
import type { Database } from '../../database/schema';

// Helper functions
async function getCommandProjects(db: Kysely<Database>, commandId: number): Promise<string[]> {
  const projects = await db
    .selectFrom('command_projects as cp')
    .innerJoin('projects as p', 'p.id', 'cp.project_id')
    .select('p.codeindex')
    .where('cp.command_id', '=', commandId)
    .execute();

  return projects.map((p) => p.codeindex).filter((code): code is string => code !== null);
}

async function getCommandTags(db: Kysely<Database>, commandId: number): Promise<string[]> {
  const tags = await db
    .selectFrom('tags as t')
    .innerJoin('command_tags as ct', 't.id', 'ct.tag_id')
    .select('t.name')
    .where('ct.command_id', '=', commandId)
    .execute();

  return tags.map((t) => t.name);
}

async function getOrCreateTag(db: Kysely<Database>, tagName: string): Promise<number> {
  const tag = await db.selectFrom('tags').select('id').where('name', '=', tagName).executeTakeFirst();

  if (tag) return tag.id;

  const result = await db.insertInto('tags').values({ name: tagName }).executeTakeFirstOrThrow();

  return Number(result.insertId);
}

export function setupImportExportHandlers(db: Kysely<Database>): void {
  // Import JSON
  ipcMain.handle('import-json', async (_event, filePath: string) => {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(data);

      if (json.projects) {
        for (const project of json.projects) {
          if (project.codeindex) {
            const existing = await db.selectFrom('projects').select('id').where('codeindex', '=', project.codeindex).executeTakeFirst();

            if (existing) {
              await db
                .updateTable('projects')
                .set({
                  name: project.name,
                  path: project.path || null,
                  updated_at: new Date().toISOString(),
                })
                .where('codeindex', '=', project.codeindex)
                .execute();
            } else {
              await db
                .insertInto('projects')
                .values({
                  codeindex: project.codeindex,
                  name: project.name,
                  path: project.path || null,
                })
                .execute();
            }
          }
        }
      }

      if (json.commands) {
        for (const command of json.commands) {
          const { codeindex, name, detail, resumen, steps, project, tags } = command;

          if (codeindex) {
            const existing = await db.selectFrom('commands').select('id').where('codeindex', '=', codeindex).executeTakeFirst();

            let commandId: number;

            if (existing) {
              await db
                .updateTable('commands')
                .set({
                  name,
                  detail,
                  resumen,
                  steps: JSON.stringify(steps),
                  updated_at: new Date().toISOString(),
                })
                .where('codeindex', '=', codeindex)
                .execute();

              commandId = existing.id;
            } else {
              const result = await db
                .insertInto('commands')
                .values({
                  codeindex,
                  name,
                  detail,
                  resumen,
                  steps: JSON.stringify(steps),
                })
                .executeTakeFirstOrThrow();

              commandId = Number(result.insertId);
            }

            // Clear existing relations
            await db.deleteFrom('command_projects').where('command_id', '=', commandId).execute();
            await db.deleteFrom('command_tags').where('command_id', '=', commandId).execute();

            // Add projects
            if (project && project.length > 0) {
              const projectRecords = await db
                .selectFrom('projects')
                .select(['id', 'codeindex'])
                .where('codeindex', 'in', project)
                .execute();

              if (projectRecords.length > 0) {
                await db
                  .insertInto('command_projects')
                  .values(
                    projectRecords.map((proj) => ({
                      command_id: commandId,
                      project_id: proj.id,
                    }))
                  )
                  .execute();
              }
            }

            // Add tags
            if (tags && tags.length > 0) {
              const tagIds = await Promise.all(tags.map((tagName: string) => getOrCreateTag(db, tagName)));

              await db
                .insertInto('command_tags')
                .values(
                  tagIds.map((tagId) => ({
                    command_id: commandId,
                    tag_id: tagId,
                  }))
                )
                .execute();
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
  ipcMain.handle('export-json', async (_event, exportPath: string) => {
    try {
      const projects = await db.selectFrom('projects').selectAll().execute();
      const commands = await db.selectFrom('commands').selectAll().execute();

      const exportData = {
        projects: projects.map((p) => ({
          codeindex: p.codeindex,
          name: p.name,
          path: p.path,
        })),
        commands: await Promise.all(
          commands.map(async (c) => ({
            codeindex: c.codeindex,
            name: c.name,
            detail: c.detail,
            resumen: c.resumen,
            steps: JSON.parse(c.steps) as Step[],
            project: await getCommandProjects(db, c.id),
            tags: await getCommandTags(db, c.id),
          }))
        ),
      };

      fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2), 'utf-8');
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
}
