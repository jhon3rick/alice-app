/**
 * Seeds Index
 *
 * Centralized seed data loader that imports and combines all seed files.
 * This file provides a unified interface for loading initial data into the database.
 */

import { tagsSeed } from './tags.seed';
import type { NewTag } from '../schema';

export interface SeedData {
  tags: Omit<NewTag, 'id' | 'created_at' | 'updated_at'>[];
  // Add more seed types here as they are created
  // projects?: Omit<NewProject, 'id' | 'created_at' | 'updated_at'>[];
  // commandTemplates?: Omit<NewCommandTemplate, 'id' | 'created_at' | 'updated_at'>[];
}

/**
 * All seed data combined
 */
export const seeds: SeedData = {
  tags: tagsSeed,
  // Add more seeds here as they are created
};

/**
 * Get all seed data
 */
export function getAllSeeds(): SeedData {
  return seeds;
}
