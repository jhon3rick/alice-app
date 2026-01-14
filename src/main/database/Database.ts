import Sqlite from 'better-sqlite3';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { Kysely, SqliteDialect } from 'kysely';
import type { Database } from './schema';
import { applySeeds } from './seeds/apply-seeds';

export class DatabaseService {
  private sqliteDb: Sqlite.Database | null = null;
  private db: Kysely<Database> | null = null;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initDatabase();
  }

  async waitForInit(): Promise<void> {
    await this.initPromise;
  }

  private async initDatabase(): Promise<void> {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'alice.db');

    // Ensure directory exists
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    this.sqliteDb = new Sqlite(dbPath);

    // Initialize Kysely with SQLite dialect
    this.db = new Kysely<Database>({
      dialect: new SqliteDialect({
        database: this.sqliteDb,
      }),
    });

    await this.createTables();
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    // Create projects table
    await this.db.schema
      .createTable('projects')
      .ifNotExists()
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('codeindex', 'text', (col) => col.unique().notNull())
      .addColumn('name', 'text', (col) => col.notNull())
      .addColumn('path', 'text')
      .addColumn('created_at', 'text', (col) => col.defaultTo('CURRENT_TIMESTAMP'))
      .addColumn('updated_at', 'text', (col) => col.defaultTo('CURRENT_TIMESTAMP'))
      .execute();

    // Create tags table
    await this.db.schema
      .createTable('tags')
      .ifNotExists()
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('codeindex', 'text', (col) => col.unique().notNull())
      .addColumn('name', 'text', (col) => col.notNull().unique())
      .addColumn('icon', 'text')
      .addColumn('created_at', 'text', (col) => col.defaultTo('CURRENT_TIMESTAMP'))
      .addColumn('updated_at', 'text', (col) => col.defaultTo('CURRENT_TIMESTAMP'))
      .execute();

    // Create command_templates table
    await this.db.schema
      .createTable('command_templates')
      .ifNotExists()
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('codeindex', 'text', (col) => col.unique().notNull())
      .addColumn('name', 'text', (col) => col.notNull())
      .addColumn('detail', 'text', (col) => col.notNull())
      .addColumn('resumen', 'text', (col) => col.notNull())
      .addColumn('steps', 'text', (col) => col.notNull())
      .addColumn('created_at', 'text', (col) => col.defaultTo('CURRENT_TIMESTAMP'))
      .addColumn('updated_at', 'text', (col) => col.defaultTo('CURRENT_TIMESTAMP'))
      .execute();

    // Create command_projects junction table
    await this.db.schema
      .createTable('command_projects')
      .ifNotExists()
      .addColumn('command_id', 'integer', (col) => col.notNull())
      .addColumn('project_id', 'integer', (col) => col.notNull())
      .addPrimaryKeyConstraint('command_projects_pk', ['command_id', 'project_id'])
      .addForeignKeyConstraint('command_projects_command_fk', ['command_id'], 'command_templates', ['id'], (cb) => cb.onDelete('cascade'))
      .addForeignKeyConstraint('command_projects_project_fk', ['project_id'], 'projects', ['id'], (cb) => cb.onDelete('cascade'))
      .execute();

    // Create command_tags junction table
    await this.db.schema
      .createTable('command_tags')
      .ifNotExists()
      .addColumn('command_id', 'integer', (col) => col.notNull())
      .addColumn('tag_id', 'integer', (col) => col.notNull())
      .addPrimaryKeyConstraint('command_tags_pk', ['command_id', 'tag_id'])
      .addForeignKeyConstraint('command_tags_command_fk', ['command_id'], 'command_templates', ['id'], (cb) => cb.onDelete('cascade'))
      .addForeignKeyConstraint('command_tags_tag_fk', ['tag_id'], 'tags', ['id'], (cb) => cb.onDelete('cascade'))
      .execute();

    // Create config table
    await this.db.schema
      .createTable('config')
      .ifNotExists()
      .addColumn('key', 'text', (col) => col.primaryKey())
      .addColumn('value', 'text', (col) => col.notNull())
      .addColumn('updated_at', 'text', (col) => col.defaultTo('CURRENT_TIMESTAMP'))
      .execute();

    // Insert default config values if not exists
    const userDataPath = app.getPath('userData');

    await this.db
      .insertInto('config')
      .values({ key: 'configPath', value: path.join(userDataPath, 'config') })
      .onConflict((oc) => oc.column('key').doNothing())
      .execute();

    await this.db
      .insertInto('config')
      .values({ key: 'exportPath', value: path.join(userDataPath, 'exports') })
      .onConflict((oc) => oc.column('key').doNothing())
      .execute();

    // Apply seed data
    await applySeeds(this.db);
  }

  getDatabase(): Kysely<Database> | null {
    return this.db;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.destroy();
      this.db = null;
    }
    if (this.sqliteDb) {
      this.sqliteDb.close();
      this.sqliteDb = null;
    }
  }
}

export const databaseService = new DatabaseService();
