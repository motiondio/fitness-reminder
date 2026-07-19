# Kaiten Mini App bot

Bu Worker Telegram Mini App orqali ISOMEDIA Kaiten boardini boshqaradi.

## Kerakli sozlamalar

Cloudflare Worker nomi:

```text
kaiten-miniapp-bot
```

KV namespace:

```text
KAITEN_STATE
```

Secretlar:

```text
TELEGRAM_BOT_TOKEN
KAITEN_API_TOKEN
GOOGLE_SERVICE_ACCOUNT_JSON
```

Oddiy variablelar `wrangler.kaiten.jsonc` ichida turibdi.

## Google Sheets

Spreadsheet `kaiten-miniapp-sheets@copper-citron-421112.iam.gserviceaccount.com` service account emailiga `Editor` qilib share qilingan bo'lishi kerak.

`GOOGLE_SERVICE_ACCOUNT_JSON` secret sifatida qo'shiladi. JSON faylni gitga qo'shmang.

```bash
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON --config wrangler.kaiten.jsonc < /Users/smartbook/Downloads/copper-citron-421112-b89556e0fb36.json
```

## Deploy

1. KV namespace yarating:

```bash
npx wrangler kv namespace create KAITEN_STATE --config wrangler.kaiten.jsonc
```

2. Chiqgan `id` qiymatini `wrangler.kaiten.jsonc` ichidagi `REPLACE_WITH_KAITEN_STATE_KV_ID` o'rniga yozing.

3. Secretlarni kiriting:

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN --config wrangler.kaiten.jsonc
npx wrangler secret put KAITEN_API_TOKEN --config wrangler.kaiten.jsonc
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON --config wrangler.kaiten.jsonc < /Users/smartbook/Downloads/copper-citron-421112-b89556e0fb36.json
```

4. Deploy qiling:

```bash
npm run deploy:kaiten
```

## Telegram webhook va Mini App menu

Deploydan keyin Worker URL shunday ko'rinishda bo'ladi:

```text
https://kaiten-miniapp-bot.<subdomain>.workers.dev
```

Webhook:

```bash
export BOT_TOKEN="BOT_TOKEN_BU_YERGA"
export WORKER_URL="https://kaiten-miniapp-bot.<subdomain>.workers.dev"

curl -X POST "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"$WORKER_URL\"}"
```

Mini App menu URL doim `/app` bilan tugashi kerak. Worker root `/` ham Mini Appni ochadi, lekin Telegram menu uchun `/app` ishlatish aniqroq.

Botga `/start`, `/app` yoki `/menu` yuborilganda Worker Telegram menu buttonni avtomatik `/app` URLga yangilaydi.

Deploy versiyasini tekshirish:

```bash
curl "$WORKER_URL/health"
```

Javobda `version` qiymati ko'rinishi kerak.

Mini App menu:

```bash
curl -X POST "https://api.telegram.org/bot$BOT_TOKEN/setChatMenuButton" \
  -H "Content-Type: application/json" \
  -d "{
    \"menu_button\": {
      \"type\": \"web_app\",
      \"text\": \"ISOMEDIA\",
      \"web_app\": { \"url\": \"$WORKER_URL/app\" }
    }
  }"
```

## Mini App imkoniyatlari

- 3 ustunli Kaiten board: Shooting day, Shooting process, DONE
- Yangi syomka yaratish
- Google Sheetsdan mijozlar ro'yxatini olish va KV cachega saqlash
- Mijozlar cacheini har 30 daqiqada cron orqali yangilash
- Mini App ichidan mijozlar bazasini qo'lda refresh qilish
- Yangi mijozni `MIJOZLAR BAZASI` sheetiga yozish
- Card title edit qilish
- Mavjud card title ichidan icon, sana, vaqt va mijozni ajratib olish
- Cardni ustundan ustunga o'tkazish
- Cardni uzoq bosib turib boshqa ustunga drag qilish
- Yangi zakaz qo'shilganda qisqa riser sound va haptic feedback
- Fixed compact UI: scale sozlamasisiz, odatdagidan taxminan 7% kichikroq
- Auto, Dark, White theme sozlamalari
- Card boxlar ichidagi title va mijoz pilllari sig'ishi uchun kontent bo'yicha balandlashadi
- Card drag paytida board horizontal scroll vaqtincha bloklanadi
- Yangi mijoz qo'shishda mavjud mijoz inputi majburiy bo'lmaydi va title ism/familiyadan yig'iladi
- Kaiten comment qo'shish
- Owner/admin uchun whitelist panel

## Local test

Production secretlarsiz UI ochib ko'rish uchun `MINI_APP_AUTH_DISABLED=1` va `GOOGLE_AUTH_DISABLED=1` faqat local muhitda ishlatiladi. Bu variablelarni productionga qo'shmang.
