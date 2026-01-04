import { databaseService } from '../database/Database';
import {
  setupProjectsHandlers,
  setupTagsHandlers,
  setupCommandsHandlers,
  setupConfigHandlers,
  setupImportExportHandlers,
  setupElectronHandlers,
} from './handlerModules';

/**
 * Setup all IPC handlers for the application
 * Handlers are organized by functionality in separate modules
 */
export function setupIpcHandlers(): void {
  const db = databaseService.getDatabase();

  // Setup database-related handlers
  if (db) {
    setupProjectsHandlers(db);
    setupTagsHandlers(db);
    setupCommandsHandlers(db);
    setupConfigHandlers(db);
    setupImportExportHandlers(db);
  }

  // Setup Electron native API handlers (don't require database)
  setupElectronHandlers();
}
