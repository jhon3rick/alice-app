import { ipcMain } from 'electron';
import type { Kysely } from 'kysely';

import type { CommandTemplate, Step } from '@tstypes/dbmodules';
import type { Database } from '../../database/schema';

// Helper functions
async function getCommandProjects(db: Kysely<Database>, commandId: number): Promise<string[]> {
  const projects = await db
    .selectFrom('projects as p')
    .innerJoin('command_projects as cp', 'p.id', 'cp.project_id')
    .select('p.name')
    .where('cp.command_id', '=', commandId)
    .execute();

  return projects.map((p) => p.name);
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

export function setupCommandTemplatesHandlers(db: Kysely<Database>): void {
  // Get command templates with filters
  ipcMain.handle('get-command-templates', async (_event, filters?: { projectId?: number; tagIds?: number[] }) => {
    let query = db.selectFrom('command_templates as c').selectAll('c').distinct();

    if (filters?.projectId !== undefined) {
      const projectId = filters.projectId;
      query = query
        .leftJoin('command_projects as cp', 'c.id', 'cp.command_id')
        .where((eb) => eb.or([eb('cp.project_id', '=', projectId), eb('cp.project_id', 'is', null)]));
    }

    if (filters?.tagIds && filters.tagIds.length > 0) {
      const tagIds = filters.tagIds;
      query = query.where('c.id', 'in', (eb) => eb.selectFrom('command_tags').select('command_id').where('tag_id', 'in', tagIds));
    }

    query = query.orderBy('c.name', 'asc');

    const commandTemplates = await query.execute();

    const result = await Promise.all(
      commandTemplates.map(async (cmd) => ({
        ...cmd,
        steps: JSON.parse(cmd.steps) as Step[],
        projects: await getCommandProjects(db, cmd.id),
        tags: await getCommandTags(db, cmd.id),
      }))
    );

    return result;
  });

  // Get single command template
  ipcMain.handle('get-command-template', async (_event, id: number) => {
    const cmd = await db.selectFrom('command_templates').selectAll().where('id', '=', id).executeTakeFirst();

    if (!cmd) return null;

    return {
      ...cmd,
      steps: JSON.parse(cmd.steps) as Step[],
      projects: await getCommandProjects(db, cmd.id),
      tags: await getCommandTags(db, cmd.id),
    };
  });

  // Create command template
  ipcMain.handle('create-command-template', async (_event, commandTemplate: CommandTemplate) => {
    const { codeindex, name, detail, resumen, steps, projects, tags } = commandTemplate;

    const result = await db
      .insertInto('command_templates')
      .values({
        codeindex: codeindex || null,
        name,
        detail,
        resumen,
        steps: JSON.stringify(steps),
      })
      .executeTakeFirstOrThrow();

    const commandId = Number(result.insertId);

    // Add projects (convert project names to IDs)
    if (projects && projects.length > 0) {
      const projectRecords = await db.selectFrom('projects').select(['id', 'name']).where('name', 'in', projects).execute();

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

    // Add tags (create if not exists)
    if (tags && tags.length > 0) {
      const tagIds = await Promise.all(tags.map((tagName) => getOrCreateTag(db, tagName)));

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

    return { id: commandId, ...commandTemplate };
  });

  // Update command template
  ipcMain.handle('update-command-template', async (_event, commandTemplate: CommandTemplate) => {
    const { id, codeindex, name, detail, resumen, steps, projects, tags } = commandTemplate;

    if (!id) throw new Error('CommandTemplate ID is required for update');

    await db
      .updateTable('command_templates')
      .set({
        codeindex: codeindex || null,
        name,
        detail,
        resumen,
        steps: JSON.stringify(steps),
        updated_at: new Date().toISOString(),
      })
      .where('id', '=', id)
      .execute();

    // Update projects (convert project names to IDs)
    await db.deleteFrom('command_projects').where('command_id', '=', id).execute();

    if (projects && projects.length > 0) {
      const projectRecords = await db.selectFrom('projects').select(['id', 'name']).where('name', 'in', projects).execute();

      if (projectRecords.length > 0) {
        await db
          .insertInto('command_projects')
          .values(
            projectRecords.map((proj) => ({
              command_id: id,
              project_id: proj.id,
            }))
          )
          .execute();
      }
    }

    // Update tags (create if not exists)
    await db.deleteFrom('command_tags').where('command_id', '=', id).execute();

    if (tags && tags.length > 0) {
      const tagIds = await Promise.all(tags.map((tagName) => getOrCreateTag(db, tagName)));

      await db
        .insertInto('command_tags')
        .values(
          tagIds.map((tagId) => ({
            command_id: id,
            tag_id: tagId,
          }))
        )
        .execute();
    }

    return commandTemplate;
  });

  // Delete command template
  ipcMain.handle('delete-command-template', async (_event, id: number) => {
    await db.deleteFrom('command_templates').where('id', '=', id).execute();
    return { success: true };
  });
}
