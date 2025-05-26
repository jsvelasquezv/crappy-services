import { getDBClient, type dbType } from '@ebola/db';
import { createRequestHandler } from 'react-router';

export interface Env {
  VALUE_FROM_CLOUDFLARE: string;
  DATABASE_URL: string;
}

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    db: dbType;
  }
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    const { db } = getDBClient(env.DATABASE_URL);
    return requestHandler(request, {
      cloudflare: { env, ctx },
      db,
    });
  },
} satisfies ExportedHandler<Env>;
