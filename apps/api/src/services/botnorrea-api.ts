type BotnoreaConfig = {
  apiUrl: string;
  username: string;
  password: string;
};

export class BotnoreaAPI {
  private config: BotnoreaConfig;
  private authHeader: string;

  constructor(config: BotnoreaConfig) {
    this.config = config;
    this.authHeader = `Basic ${btoa(`${config.username}:${config.password}`)}`;
  }

  async sendTelegramMessage(text: string, chatId: number): Promise<Response> {
    return fetch(`${this.config.apiUrl}/telegram/send-message`, {
      method: 'POST',
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        chat_id: chatId,
      }),
    });
  }

  async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    return fetch(`${this.config.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }
}