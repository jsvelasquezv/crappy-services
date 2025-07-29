import factoryWithDB from '../factories/app-with-db';
import { getByBirthday, getNextNBirthdays } from '../users/repository';
import { vValidator } from '@hono/valibot-validator';
import {
  object,
  optional,
  pipe,
  string,
  transform,
  integer,
  minValue,
  maxValue,
} from 'valibot';

const app = factoryWithDB.createApp();

const NextBirthdaysSchema = object({
  n: optional(
    pipe(string(), transform(Number), integer(), minValue(1), maxValue(10)),
    '5'
  ),
});

app.get('/', async (c) => {
  const db = c.get('db');
  const users = await getByBirthday(db);

  return c.json(users);
});

app.on(
  ['GET', 'POST'],
  '/next',
  vValidator('query', NextBirthdaysSchema),
  async (c) => {
    const { n } = c.req.valid('query');

    const db = c.get('db');
    const users = await getNextNBirthdays(db, n);

    return c.json(users);
  }
);

export default app;
