import { Hono } from 'hono';
import { createDB } from './db';
import {
  getByBirthday,
  getByUsername,
  getNextNBirthdays,
} from './users/repository';

export type Env = {
  D1_DB: D1Database;
  BOTNORREA_API_URL: string;
  BOTNORREA_USERNAME: string;
  BOTNORREA_PASSWORD: string;
  BOTNORREA_CHAT_ID: number;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/birthdays', async (c) => {
  const db = createDB(c.env.D1_DB);
  const users = await getByBirthday(db);

  return c.json(users);
});

app.get('/birthdays/next', async (c) => {
  const n = +(c.req.query('n') || 5);
  if (isNaN(n) || n <= 0 || n > 10) {
    return c.json({ error: 'Invalid number parameter, min 1, max 10' }, 400);
  }

  const db = createDB(c.env.D1_DB);
  const users = await getNextNBirthdays(db, n);

  return c.json(users);
});

app.get('/users/:username', async (c) => {
  const username = c.req.param('username');
  const db = createDB(c.env.D1_DB);
  const user = await getByUsername(db, username);

  return c.json(user);
});

app.get('/exchange', async (c) => {
  const page = await fetch('https://www.google.com/finance/quote/USD-COP');
  const html = await page.text();

  const usdMatch = html.match(/data-source="USD".*?data-last-price="([\d.]+)"/);
  const eurMatch = html.match(/data-source="EUR".*?data-price="([\d.]+)"/);
  const gbpMatch = html.match(/data-source="GBP".*?data-price="([\d.]+)"/);

  const usd = usdMatch ? usdMatch[1] : 'N/A';
  const eur = eurMatch ? eurMatch[1] : 'N/A';
  const gbp = gbpMatch ? gbpMatch[1] : 'N/A';

  return c.json({ usd, eur, gbp });
});

// TODO: Refactor cron logic
export default {
  fetch: app.fetch,
  async scheduled(
    controller: ScheduledController,
    env: Env,
    _ctx: ExecutionContext
  ) {
    switch (controller.cron) {
      case '30 13 * * *':
        const db = createDB(env.D1_DB);
        const users = await getByBirthday(db);
        if (users.length <= 0) {
          console.log('No birthdays today :(');
          return;
        }
        const usernames = users.map((user) => '@' + user.username).join(' ');
        console.log('Happy birthday', usernames);
        const birtdayMessage = 'Feliz pumpesito 🥳🎉 ' + usernames;
        const auth = btoa(
          `${env.BOTNORREA_USERNAME}:${env.BOTNORREA_PASSWORD}`
        );
        await fetch(env.BOTNORREA_API_URL + '/telegram/send-message', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            text: birtdayMessage,
            chat_id: env.BOTNORREA_CHAT_ID,
          }),
        });
        break;
    }
  },
};
