import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { users } from '../db';
import * as schema from '../db/schema';

export function getByBirthday(db: DrizzleD1Database<typeof schema>) {
  const date = format(new Date(), 'MM-dd');
  return db.select().from(users).where(eq(users.dateOfBirth, date));
}

export function getByUsername(
  db: DrizzleD1Database<typeof schema>,
  username: string
) {
  return db.select().from(users).where(eq(users.username, username));
}
