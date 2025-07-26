import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { v7 as uuidv7 } from 'uuid';

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  email: text('email'),
  username: text('username').notNull(),
  dateOfBirth: text('date_of_birth'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
