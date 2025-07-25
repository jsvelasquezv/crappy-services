import { Hono } from 'hono';
import { createDB, users } from './db';

export type Env = {
  D1_DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/birthdays', async (c) => {
  const db = createDB(c.env.D1_DB);
  const usrs = await db.select().from(users);
  return c.json(usrs);
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

export default app;
