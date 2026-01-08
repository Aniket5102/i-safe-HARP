
import { Pool } from 'pg';

// This is a singleton to ensure we only have one pool instance.
let pool: Pool | undefined;

export function getDbPool() {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || "postgresql://postgres:postgres@localhost:5432/isafe_app";
    
    if (!connectionString) {
      throw new Error(
        'POSTGRES_URL environment variable is not set. Please create a .env.local file and add it.'
      );
    }
    pool = new Pool({
      connectionString: connectionString,
    });
  }
  return pool;
}
