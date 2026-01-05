import { ipcMain } from 'electron';
import type { Kysely } from 'kysely';

import type { Database } from '../../database/schema';

export function setupConfigHandlers(db: Kysely<Database>): void {
  // Get config
  ipcMain.handle('get-config', async () => {
    const rows = await db.selectFrom('config').selectAll().execute();
    const config: Record<string, string> = {};
    rows.forEach(row => {
      config[row.key] = row.value;
    });
    return config;
  });

  // Update config
  ipcMain.handle('update-config', async (_event, key: string, value: string) => {
    await db
      .insertInto('config')
      .values({
        key,
        value,
        updated_at: new Date().toISOString(),
      })
      .onConflict((oc) =>
        oc.column('key').doUpdateSet({
          value,
          updated_at: new Date().toISOString(),
        })
      )
      .execute();

    return { key, value };
  });
}
