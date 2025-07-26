import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});

// TODO: Check this later to setup local migrations https://github.com/drizzle-team/drizzle-orm/discussions/1388
// TODO: Check this later to setup multiple https://github.com/drizzle-team/drizzle-orm/discussions/2832 config per env
