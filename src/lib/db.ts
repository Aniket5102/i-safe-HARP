'use server';

import { Pool } from 'pg';

// This is a singleton to ensure we only have one pool instance.
let pool: Pool | undefined;

export function getDbPool() {
  if (!pool) {
    if (!process.env.POSTGRES_URL) {
      throw new Error(
        'POSTGRES_URL environment variable is not set. Please create a .env.local file and add it.'
      );
    }
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }
  return pool;
}
