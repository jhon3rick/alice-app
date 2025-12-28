import Database from 'better-sqlite3';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export class DatabaseService {
  private db: Database.Database | null = null;

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): void {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'alice.db');

    // Ensure directory exists
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.createTables();
  }

  private createTables(): void {
    if (!this.db) return;

    // Create projects table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codeindex TEXT UNIQUE,
        name TEXT NOT NULL,
        path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create tags table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codeindex TEXT UNIQUE,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create command_templates table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS command_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codeindex TEXT UNIQUE,
        name TEXT NOT NULL,
        detail TEXT NOT NULL,
        resumen TEXT NOT NULL,
        steps TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create command_projects junction table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS command_projects (
        command_id INTEGER NOT NULL,
        project_id INTEGER NOT NULL,
        PRIMARY KEY (command_id, project_id),
        FOREIGN KEY (command_id) REFERENCES command_templates(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );
    `);

    // Create command_tags junction table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS command_tags (
        command_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (command_id, tag_id),
        FOREIGN KEY (command_id) REFERENCES command_templates(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );
    `);

    // Create config table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default config values if not exists
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO config (key, value) VALUES (?, ?)
    `);

    const userDataPath = app.getPath('userData');
    stmt.run('configPath', path.join(userDataPath, 'config'));
    stmt.run('exportPath', path.join(userDataPath, 'exports'));
  }

  getDatabase(): Database.Database | null {
    return this.db;
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export const databaseService = new DatabaseService();
