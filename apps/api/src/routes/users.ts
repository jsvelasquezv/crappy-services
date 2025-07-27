import factoryWithDB from '../factories/app-with-db';
import { getByUsername } from '../users/repository';

const app = factoryWithDB.createApp();

app.get('/:username', async (c) => {
  const username = c.req.param('username');
  const db = c.get('db');
  const user = await getByUsername(db, username);

  return c.json(user);
});

export default app;