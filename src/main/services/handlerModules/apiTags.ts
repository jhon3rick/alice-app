import { ipcMain } from 'electron';
import type { Kysely } from 'kysely';

import type { Database, NewTag, TagUpdate } from '../../database/schema';

export function setupTagsHandlers(db: Kysely<Database>): void {
  // Get all tags
  ipcMain.handle('get-tags', async () => {
    return await db.selectFrom('tags').selectAll().orderBy('name', 'asc').execute();
  });

  // Create tag
  ipcMain.handle('create-tag', async (_event, tag: { codeindex: string; name: string, icon?: string }) => {
    const newTag: NewTag = {
      codeindex: tag.codeindex,
      name: tag.name,
      icon: tag.icon || null,
    };

    const result = await db.insertInto('tags').values(newTag).executeTakeFirstOrThrow();

    return { id: Number(result.insertId), ...tag };
  });

  // Update tag
  ipcMain.handle('update-tag', async (_event, tag: { id: number; codeindex: string; name: string, icon?: string }) => {
    const updateData: TagUpdate = {
      codeindex: tag.codeindex,
      name: tag.name,
      icon: tag.icon || null,
      updated_at: new Date().toISOString(),
    };

    await db.updateTable('tags').set(updateData).where('id', '=', tag.id).execute();

    return tag;
  });

  // Delete tag
  ipcMain.handle('delete-tag', async (_event, id: number) => {
    await db.deleteFrom('tags').where('id', '=', id).execute();
    return { success: true };
  });
}
