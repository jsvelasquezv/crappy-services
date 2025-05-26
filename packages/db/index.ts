import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';

import * as schema from './schema';

export type dbType = NeonHttpDatabase<typeof schema>;

export function getDBClient(url: string) {
  const sql = neon(url);
  const db = drizzle(sql, { schema, casing: 'snake_case' });
  return { sql, db };
}
