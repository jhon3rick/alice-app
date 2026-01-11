import { databaseService } from '../database/Database';
import {
  setupProjectsHandlers,
  setupTagsHandlers,
  setupCommandTemplatesHandlers,
  setupConfigHandlers,
  setupImportExportHandlers,
  setupElectronHandlers,
  setupTerminalHandlers,
} from './handlerModules';

/**
 * Setup all IPC handlers for the application
 * Handlers are organized by functionality in separate modules
 */
export async function setupIpcHandlers(): Promise<void> {
  // Wait for database initialization to complete
  await databaseService.waitForInit();

  const db = databaseService.getDatabase();

  // Setup database-related handlers
  if (db) {
    setupProjectsHandlers(db);
    setupTagsHandlers(db);
    setupCommandTemplatesHandlers(db);
    setupConfigHandlers(db);
    setupImportExportHandlers(db);
  }

  // Setup Electron native API handlers (don't require database)
  setupElectronHandlers();
  setupTerminalHandlers();
}
