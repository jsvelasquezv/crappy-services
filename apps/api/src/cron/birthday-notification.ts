import { createDB } from '../db';
import { BotnoreaAPI } from '../services/botnorrea-api';
import type { Env } from '../types/env';
import { getByBirthday } from '../users/repository';

export async function handleBirthdayNotification(env: Env) {
  const db = createDB(env.D1_DB);
  const users = await getByBirthday(db);

  if (users.length <= 0) {
    console.log('No birthdays today :(');
    return;
  }

  const usernames = users.map((user) => '@' + user.username).join(' ');
  console.log('Happy birthday', usernames);

  const birthdayMessage = 'Feliz pumpesito 🥳🎉 ' + usernames;

  const botnoreaAPI = new BotnoreaAPI({
    apiUrl: env.BOTNORREA_API_URL,
    username: env.BOTNORREA_USERNAME,
    password: env.BOTNORREA_PASSWORD,
  });

  try {
    await botnoreaAPI.sendTelegramMessage(
      birthdayMessage,
      env.BOTNORREA_CHAT_ID
    );
  } catch (error) {
    console.error('Failed to send birthday message:', error);
  }
}
