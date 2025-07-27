import { format } from 'date-fns';
import { eq, isNotNull, sql } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { users } from '../db';
import * as schema from '../db/schema';

export function getByBirthday(db: DrizzleD1Database<typeof schema>) {
  const date = format(new Date(), 'MM-dd');
  return db.select().from(users).where(eq(users.dateOfBirth, date));
}

export function getNextNBirthdays(
  db: DrizzleD1Database<typeof schema>,
  n: number
) {
  const now = new Date();
  const today = format(now, 'MM-dd');
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;

  return db
    .select()
    .from(users)
    .where(isNotNull(users.dateOfBirth))
    .orderBy(
      sql`
        CASE 
          WHEN ${users.dateOfBirth} >= ${today} THEN ${currentYear} || '-' || ${users.dateOfBirth}
          ELSE ${nextYear} || '-' || ${users.dateOfBirth}
        END
      `
    )
    .limit(n);
}

export function getByUsername(
  db: DrizzleD1Database<typeof schema>,
  username: string
) {
  return db.select().from(users).where(eq(users.username, username));
}
