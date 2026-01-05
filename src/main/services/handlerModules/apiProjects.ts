import { ipcMain } from 'electron';
import type { Kysely } from 'kysely';

import type { Database, NewProject, ProjectUpdate } from '../../database/schema';

export function setupProjectsHandlers(db: Kysely<Database>): void {
  // Get all projects
  ipcMain.handle('get-projects', async () => {
    return await db
      .selectFrom('projects')
      .selectAll()
      .orderBy('name', 'asc')
      .execute();
  });

  // Create project
  ipcMain.handle('create-project', async (_event, project: { codeindex?: string; name: string; path?: string }) => {
    const newProject: NewProject = {
      codeindex: project.codeindex || null,
      name: project.name,
      path: project.path || null,
    };

    const result = await db
      .insertInto('projects')
      .values(newProject)
      .executeTakeFirstOrThrow();

    return { id: Number(result.insertId), ...project };
  });

  // Update project
  ipcMain.handle('update-project', async (_event, project: { id: number; codeindex?: string; name: string; path?: string }) => {
    const updateData: ProjectUpdate = {
      codeindex: project.codeindex || null,
      name: project.name,
      path: project.path || null,
      updated_at: new Date().toISOString(),
    };

    await db
      .updateTable('projects')
      .set(updateData)
      .where('id', '=', project.id)
      .execute();

    return project;
  });

  // Delete project
  ipcMain.handle('delete-project', async (_event, id: number) => {
    await db.deleteFrom('projects').where('id', '=', id).execute();
    return { success: true };
  });
}
