import factoryWithDB from '../factories/app-with-db';
import { getByBirthday, getNextNBirthdays } from '../users/repository';

const app = factoryWithDB.createApp();

app.get('/', async (c) => {
  const db = c.get('db');
  const users = await getByBirthday(db);

  return c.json(users);
});

app.on(['GET', 'POST'], '/next', async (c) => {
  const n = parseInt(c.req.query('n') || '5');
  if (isNaN(n) || n <= 0 || n > 10) {
    return c.json({ error: 'Invalid number parameter, min 1, max 10' }, 400);
  }

  const db = c.get('db');
  const users = await getNextNBirthdays(db, n);

  return c.json(users);
});

export default app;
