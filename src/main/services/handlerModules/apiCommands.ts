import { ipcMain } from 'electron';
import type { Kysely } from 'kysely';

import type { Command, Step } from '@tstypes/dbmodules';
import type { Database } from '../../database/schema';

// Helper functions
async function getCommandProjects(db: Kysely<Database>, commandId: number): Promise<string[]> {
  const projects = await db
    .selectFrom('projects as p')
    .innerJoin('command_projects as cp', 'p.id', 'cp.project_id')
    .select('p.name')
    .where('cp.command_id', '=', commandId)
    .execute();

  return projects.map(p => p.name);
}

async function getCommandTags(db: Kysely<Database>, commandId: number): Promise<string[]> {
  const tags = await db
    .selectFrom('tags as t')
    .innerJoin('command_tags as ct', 't.id', 'ct.tag_id')
    .select('t.name')
    .where('ct.command_id', '=', commandId)
    .execute();

  return tags.map(t => t.name);
}

async function getOrCreateTag(db: Kysely<Database>, tagName: string): Promise<number> {
  const tag = await db
    .selectFrom('tags')
    .select('id')
    .where('name', '=', tagName)
    .executeTakeFirst();

  if (tag) return tag.id;

  const result = await db
    .insertInto('tags')
    .values({ name: tagName })
    .executeTakeFirstOrThrow();

  return Number(result.insertId);
}

export function setupCommandsHandlers(db: Kysely<Database>): void {
  // Get commands with filters
  ipcMain.handle('get-commands', async (_event, filters?: { projectId?: number; tagIds?: number[] }) => {
    let query = db
      .selectFrom('commands as c')
      .selectAll('c')
      .distinct();

    if (filters?.projectId !== undefined) {
      const projectId = filters.projectId;
      query = query
        .leftJoin('command_projects as cp', 'c.id', 'cp.command_id')
        .where((eb) =>
          eb.or([
            eb('cp.project_id', '=', projectId),
            eb('cp.project_id', 'is', null),
          ])
        );
    }

    if (filters?.tagIds && filters.tagIds.length > 0) {
      const tagIds = filters.tagIds;
      query = query.where('c.id', 'in', (eb) =>
        eb
          .selectFrom('command_tags')
          .select('command_id')
          .where('tag_id', 'in', tagIds)
      );
    }

    query = query.orderBy('c.name', 'asc');

    const commands = await query.execute();

    const result = await Promise.all(
      commands.map(async (cmd) => ({
        ...cmd,
        steps: JSON.parse(cmd.steps) as Step[],
        projects: await getCommandProjects(db, cmd.id),
        tags: await getCommandTags(db, cmd.id),
      }))
    );

    return result;
  });

  // Get single command
  ipcMain.handle('get-command', async (_event, id: number) => {
    const cmd = await db
      .selectFrom('commands')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!cmd) return null;

    return {
      ...cmd,
      steps: JSON.parse(cmd.steps) as Step[],
      projects: await getCommandProjects(db, cmd.id),
      tags: await getCommandTags(db, cmd.id),
    };
  });

  // Create command
  ipcMain.handle('create-command', async (_event, command: Command) => {
    const { codeindex, name, detail, resumen, steps, projects, tags } = command;

    const result = await db
      .insertInto('commands')
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
      const projectRecords = await db
        .selectFrom('projects')
        .select(['id', 'name'])
        .where('name', 'in', projects)
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

    return { id: commandId, ...command };
  });

  // Update command
  ipcMain.handle('update-command', async (_event, command: Command) => {
    const { id, codeindex, name, detail, resumen, steps, projects, tags } = command;

    if (!id) throw new Error('Command ID is required for update');

    await db
      .updateTable('commands')
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
      const projectRecords = await db
        .selectFrom('projects')
        .select(['id', 'name'])
        .where('name', 'in', projects)
        .execute();

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

    return command;
  });

  // Delete command
  ipcMain.handle('delete-command', async (_event, id: number) => {
    await db.deleteFrom('commands').where('id', '=', id).execute();
    return { success: true };
  });
}
