import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
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

export const media = sqliteTable('media', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  fileName: text('file_name').notNull(),
  originalName: text('original_name').notNull(),
  title: text('title'),
  tags: text('tags', { mode: 'json' }).$type<string[]>(),
  fileSize: integer('file_size').notNull(),
  mimeType: text('mime_type').notNull(),
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
export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;
