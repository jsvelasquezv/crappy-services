import factoryWithDB from '../factories/app-with-db';
import { BotnoreaAPI } from '../services/botnorrea-api';
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

    const body = await c.req.json();
    const chatId = body?.chat?.id;
    if (chatId !== c.env.BOTNORREA_CHAT_ID) {
      return c.json(
        { error: 'Unauthorized to do this action in this chat' },
        403
      );
    }

    const replyToMessageId = body?.message?.message_id;

    const db = c.get('db');
    const users = await getNextNBirthdays(db, n);

    const usernames = users
      .map((user) => `@${user?.username} - ${user?.dateOfBirth}`)
      .join('\n');

    const botnoreaAPI = new BotnoreaAPI({
      apiUrl: c.env.BOTNORREA_API_URL,
      username: c.env.BOTNORREA_USERNAME,
      password: c.env.BOTNORREA_PASSWORD,
    });

    try {
      await botnoreaAPI.sendTelegramMessage(
        `Siguientes pumpesitos 🥳🎉:\n${usernames}`,
        c.env.BOTNORREA_CHAT_ID,
        replyToMessageId
      );
    } catch (error) {
      console.error('Failed to send birthday message:', error);
      return c.json({ error: 'Failed to send birthday message' }, 500);
    }

    return c.json({ message: 'ok' });
  }
);

export default app;
