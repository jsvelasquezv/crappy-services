import { Hono } from 'hono';
import { handleBirthdayNotification } from './cron/birthday-notification';
import birthdaysRoutes from './routes/birthdays';
import exchangeRoutes from './routes/exchange';
import usersRoutes from './routes/users';
import type { Env } from './types/env';

const app = new Hono();

app.route('/birthdays', birthdaysRoutes);
app.route('/users', usersRoutes);
app.route('/exchange', exchangeRoutes);

export default {
  fetch: app.fetch,
  async scheduled(
    controller: ScheduledController,
    env: Env,
    _ctx: ExecutionContext
  ) {
    switch (controller.cron) {
      case '30 13 * * *':
        await handleBirthdayNotification(env);
        break;
    }
  },
};
