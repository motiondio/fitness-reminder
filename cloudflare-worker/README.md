# Cloudflare Worker Telegram bot

Bu Worker Telegram botga yozilganda darhol javob berish uchun kerak.

## Secretlar

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `NATIVE_CHECKLIST_CHAT_ID`
- `FITNESS_START_DATE`

`FITNESS_START_DATE` qiymati: `2026-07-19`

## Deploy

### Eng sodda yo'l: dashboard orqali qo'lda deploy

Cloudflare Git deploy ekrani ishlamasa, uni ishlatish shart emas.

1. Cloudflare'da **Workers & Pages** ga kiring.
2. **Create Worker** bosing.
3. Oddiy "Hello World" Worker yarating.
4. **Deploy** bosing.
5. Worker ochilgach **Edit code** bosing.
6. `cloudflare-worker/fitness_bot_worker.js` ichidagi kodni to'liq paste qiling.
7. **Save and deploy** bosing.
8. Worker URL'ni oling, masalan: `https://fitness-reminder.username.workers.dev`

Keyin Worker **Settings** -> **Variables** ichida secretlar qo'shiladi:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Oddiy variable:

- `FITNESS_START_DATE=2026-07-19`
- `NATIVE_CHECKLIST_CHAT_ID=8967190826`

### GitHub repo orqali deploy

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
- `/checklist`
- `checklist`
- `/tomorrow`
- `ertaga`
- `/help`

## Native Telegram checklist

Oddiy bot xabaridagi `☐` belgilar faqat matn. Telegram'ning bosiladigan native checklist kartasi uchun Business / Secretary Mode kerak.

Status:

- Business / Secretary Mode: ulangan
- `BUSINESS_CONNECTION_ID`: olingan
- Keyingi qadam: Cloudflare Worker Variables ichiga `BUSINESS_CONNECTION_ID` qo'shish

To'g'ri oqim:

1. @BotFather ichida bot uchun Business / Secretary Mode yoqiladi.
2. Telegram Business -> Chatbots ichida bot akkauntga ulanadi.
3. Webhook `business_connection` update oladi.
4. Bot `BUSINESS_CONNECTION_ID` ni yuboradi.
5. Cloudflare Worker Variables ichiga `BUSINESS_CONNECTION_ID` qo'shiladi.
6. `/today`, `bugun nima qilishim kerak`, `/checklist` yoki `checklist` yozilganda bot `sendChecklist` ishlatadi.

Rasmiy Bot API bo'yicha:

- `Update` ichida `business_connection` va `business_message` maydonlari bor.
- `sendChecklist` uchun `business_connection_id`, `chat_id`, `checklist` kerak.
- `InputChecklist` 1-30 ta task qabul qiladi.

Eslatma: Business account o'ziga xabar yubora olmaydi. Shuning uchun native checklist target chat sifatida botning numeric ID qiymatiga yuboriladi: `8967190826`.
