/**
 * Apply Seeds
 *
 * Handles the loading and insertion of seed data into the database.
 * This module provides a generic, iterative approach to applying seeds
 * for all tables in the database.
 */

import { Kysely } from 'kysely';
import type { Database } from '../schema';
import { getAllSeeds, type SeedData } from './index';

/**
 * Table names that can receive seed data
 */
type SeedableTable = keyof SeedData;

/**
 * Apply all seed data to the database
 *
 * This function iterates through all available seed data and inserts it
 * into the corresponding tables. It only inserts data if the table is empty,
 * preventing duplicate entries on subsequent runs.
 *
 * @param db - Kysely database instance
 */
export async function applySeeds(db: Kysely<Database>): Promise<void> {
  const seeds = getAllSeeds();

  // Iterate through all seed categories
  for (const [tableName, seedData] of Object.entries(seeds) as [SeedableTable, T[]][]) {
    if (!seedData || seedData.length === 0) {
      continue;
    }

    try {
      // Check if table is empty
      const tableIsEmpty = await isTableEmpty(db, tableName);

      if (tableIsEmpty) {
        // Insert all seed data for this table
        await insertSeedData(db, tableName, seedData);
        console.log(`✓ Loaded ${seedData.length} ${tableName} from seed data`);
      } else {
        console.log(`⊘ Skipped ${tableName} seed data (table not empty)`);
      }
    } catch (error) {
      console.error(`✗ Error loading ${tableName} seed data:`, error);
      throw error;
    }
  }
}

/**
 * Check if a table is empty
 *
 * @param db - Kysely database instance
 * @param tableName - Name of the table to check
 * @returns True if table is empty, false otherwise
 */
async function isTableEmpty(db: Kysely<Database>, tableName: SeedableTable): Promise<boolean> {
  const result = await db
    .selectFrom(tableName as See)
    .selectAll()
    .limit(1)
    .execute();

  return result.length === 0;
}

/**
 * Insert seed data into a table
 *
 * @param db - Kysely database instance
 * @param tableName - Name of the table to insert into
 * @param seedData - Array of seed records to insert
 */
async function insertSeedData(
  db: Kysely<Database>,
  tableName: SeedableTable,
  seedData: T[]
): Promise<void> {
  // Insert records one by one to handle potential conflicts gracefully
  for (const record of seedData) {
    try {
      await db
        .insertInto(tableName as SeedableTable)
        .values(record)
        .execute();
    } catch (error) {
      console.warn(`Warning: Could not insert ${tableName} record:`, record, error);
      // Continue with next record even if one fails
    }
  }
}

/**
 * Force reload all seed data (clears tables and reinserts)
 *
 * WARNING: This will delete all existing data in the seeded tables!
 * Use only for development or explicit reset operations.
 *
 * @param db - Kysely database instance
 */
export async function forceReloadSeeds(db: Kysely<Database>): Promise<void> {
  const seeds = getAllSeeds();

  console.log('⚠ Force reloading seed data (this will clear existing data)...');

  for (const [tableName, seedData] of Object.entries(seeds) as [SeedableTable, T[]][]) {
    if (!seedData || seedData.length === 0) {
      continue;
    }

    try {
      // Delete all existing records
      await db
        .deleteFrom(tableName as SeedableTable)
        .execute();

      // Insert fresh seed data
      await insertSeedData(db, tableName, seedData);
      console.log(`✓ Force reloaded ${seedData.length} ${tableName} from seed data`);
    } catch (error) {
      console.error(`✗ Error force reloading ${tableName} seed data:`, error);
      throw error;
    }
  }
}
