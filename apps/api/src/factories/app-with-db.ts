import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { createFactory } from 'hono/factory';
import { createDB } from '../db';
import * as schema from '../db/schema';
import type { Env as EnvBindings } from '../types/env';

type Env = {
  Bindings: EnvBindings;
  Variables: {
    db: DrizzleD1Database<typeof schema>;
  };
};

export default createFactory<Env>({
  initApp: (app) => {
    app.use(async (c, next) => {
      const db = createDB(c.env.D1_DB);
      c.set('db', db);
      await next();
    });
  },
});
