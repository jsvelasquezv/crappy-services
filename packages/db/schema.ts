import {
  boolean,
  pgTable,
  serial,
  smallint,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial().primaryKey(), // TODO: make it an UUID
  telegramUsername: varchar({ length: 255 }).notNull(),
  bdDay: smallint(),
  bbMonth: smallint(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(), // TODO: make it an UUID
  username: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  active: boolean().default(true),
  createdBy: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});
