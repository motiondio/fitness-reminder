# Cloudflare Worker Telegram bot

Bu Worker Telegram botga yozilganda darhol javob berish uchun kerak.

## Secretlar

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `FITNESS_START_DATE`

`FITNESS_START_DATE` qiymati: `2026-07-19`

## Deploy

Cloudflare'da Worker yarating va `fitness_bot_worker.js` ichidagi kodni joylang.

GitHub repo orqali deploy qilinsa:

```text
Build command: npm install
Deploy command: npm run deploy
```

Keyin Telegram webhook ulash kerak:

```bash
curl "https://api.telegram.org/botBOT_TOKEN/setWebhook?url=https://YOUR_WORKER.YOUR_SUBDOMAIN.workers.dev"
```

Tekshirish:

```bash
curl "https://api.telegram.org/botBOT_TOKEN/getWebhookInfo"
```

## Bot buyruqlari

- `/today`
- `bugun nima qilishim kerak`
- `/tomorrow`
- `ertaga`
- `/help`
