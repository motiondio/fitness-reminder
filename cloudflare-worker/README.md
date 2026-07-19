# Cloudflare Worker Telegram bot

Bu Worker Telegram botga yozilganda darhol javob berish uchun kerak.

## Secretlar

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `NATIVE_CHECKLIST_CHAT_ID`
- `TELEGRAM_ALLOWED_CHAT_IDS`
- `TELEGRAM_TOPIC_ID`
- `FITNESS_START_DATE`
- `PRAYER_CHAT_ID`
- `PRAYER_TOPIC_ID`
- `PRAYER_SOURCE`
- `PRAYER_REGION`
- `PRAYER_REGION_SLUG`
- `PRAYER_CITY`
- `PRAYER_COUNTRY`
- `PRAYER_METHOD`
- `PRAYER_SCHOOL`
- `PRAYER_REMINDER_INTERVAL_MINUTES`
- `PRAYER_TIMES`
- `PRAYER_DISABLE_FALLBACK`
- `MINI_APP_URL`
- `MINI_APP_CHAT_ID`
- `MINI_APP_FITNESS_CHAT_ID`
- `MINI_APP_ALLOWED_USER_IDS`
- `MINI_APP_AUTH_MAX_AGE_SECONDS`
- `MINI_APP_AUTH_DISABLED`

`FITNESS_START_DATE` qiymati: `2026-07-19`

Namoz uchun tavsiya qilingan qiymatlar:

```text
PRAYER_CHAT_ID=-1002781399618
PRAYER_TOPIC_ID=namoz_topic_thread_id
PRAYER_SOURCE=namozvaqti
PRAYER_REGION=toshkent-shahri
PRAYER_REMINDER_INTERVAL_MINUTES=10
```

`PRAYER_TOPIC_ID` alohida namoz topici uchun ishlaydi. Agar qo'shilmasa, bot `TELEGRAM_TOPIC_ID` ga yozadi.

`PRAYER_REGION` uchun `namoz-vaqti.uz` region slug ishlatiladi. Toshkent shahri uchun qiymat: `toshkent-shahri`.

`PRAYER_CITY`, `PRAYER_COUNTRY`, `PRAYER_METHOD`, `PRAYER_SCHOOL` faqat fallback manba AlAdhan uchun kerak. `namoz-vaqti.uz` ishlamasa, bot avtomatik fallback qiladi.

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
- `TELEGRAM_ALLOWED_CHAT_IDS=8084782034,-1002781399618`
- `TELEGRAM_TOPIC_ID=topic_id`
- `MINI_APP_URL=https://fitness-reminder.shahzod-rmusic.workers.dev/app`
- `MINI_APP_ALLOWED_USER_IDS=8084782034`

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

Command menu yangilash:

```bash
curl -X POST "https://api.telegram.org/botBOT_TOKEN/setMyCommands" \
  -H "Content-Type: application/json" \
  -d '{
    "commands": [
      {"command": "start", "description": "Bot menyusi"},
      {"command": "app", "description": "Telegram Mini App"},
      {"command": "today", "description": "Bugungi fitness checklist"},
      {"command": "tomorrow", "description": "Ertangi fitness checklist"},
      {"command": "namoz", "description": "Bugungi namoz vaqtlari"},
      {"command": "qazo", "description": "Qazo panel"},
      {"command": "qazo_set", "description": "Qazo sonini kiritish"},
      {"command": "threadid", "description": "Topic ID olish"},
      {"command": "status", "description": "Bot status"}
    ]
  }'
```

Mini Appni Telegram menu buttonga qo'yish:

```bash
curl -X POST "https://api.telegram.org/botBOT_TOKEN/setChatMenuButton" \
  -H "Content-Type: application/json" \
  -d '{
    "menu_button": {
      "type": "web_app",
      "text": "Mini App",
      "web_app": {
        "url": "https://fitness-reminder.shahzod-rmusic.workers.dev/app"
      }
    }
  }'
```

Agar xabar yoziladigan joyda `Mini App` o'rniga uch chiziqli command menu chiqaversa, menu buttonni aniq private chat ID uchun qo'ying:

```bash
curl -X POST "https://api.telegram.org/botBOT_TOKEN/setChatMenuButton" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": 8084782034,
    "menu_button": {
      "type": "web_app",
      "text": "Mini App",
      "web_app": {
        "url": "https://fitness-reminder.shahzod-rmusic.workers.dev/app"
      }
    }
  }'
```

Tekshirish:

```bash
curl -X POST "https://api.telegram.org/botBOT_TOKEN/getChatMenuButton" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": 8084782034}'
```

Javobda `"type":"web_app"` chiqishi kerak. Agar `"type":"commands"` yoki `"type":"default"` chiqsa, Telegram hali pastki menu buttonni Mini Appga almashtirmagan.

## Bot buyruqlari

- `/app`
- `/today`
- `bugun nima qilishim kerak`
- `/checklist`
- `checklist`
- `/reset`
- `/chatid`
- `/threadid`
- `/status`
- `/tomorrow`
- `ertaga`
- `/namoz`
- `/qazo`
- `/qazo_set bomdod 10`
- `/qazo_add peshin 1`
- `/qazo_minus asr 1`
- `/qazo_set vitr 10`
- `/qazo_bulk bomdod=10 peshin=10 asr=10 shom=10 xufton=10 vitr=10`
- `/help`

## Telegram Mini App

Worker ichida Mini App ham bor:

```text
https://fitness-reminder.shahzod-rmusic.workers.dev/app
```

Mini App bo'limlari:

- Fitness: kunlar bo'yicha checklist, chap/o'ng swipe yoki `‹` / `›` tugmalari bilan sana almashtirish, silliq motion animatsiyalar, `Hammasi`, `Reset`
- Namoz: bugungi namoz vaqtlari, `O'qidim`, `Qazo`
- Qazo: Bomdod, Peshin, Asr, Shom, Xufton, Vitr sonlarini `+`, `-` yoki qo'lda raqam kiritib saqlash
- Tasbeh: 33/99 talik sanoq, 10 xil zikr, sanoq tugaganda keyingi zikrga avtomatik o'tish, umumiy zikrlar sonini doimiy saqlash
- Har bo'limda mavzuga mos qorong'i/blur background rasm bor.

Mini App API endpointlari:

- `GET /api/app-state`
- `POST /api/checklist-toggle`
- `POST /api/prayer-done`
- `POST /api/qazo-adjust`
- `POST /api/qazo-bulk`
- `POST /api/tasbeh`

Xavfsizlik:

- Mini App API Telegram `initData` imzosini tekshiradi.
- `MINI_APP_ALLOWED_USER_IDS=8084782034` qo'yilsa, faqat shu Telegram user ID ishlata oladi.
- `MINI_APP_AUTH_DISABLED=1` faqat local test uchun. Production Worker'da buni qo'ymang.

Telegram `web_app` tugmasi private chatda ishlaydi. Supergroup/topic ichida bot menyusi eski inline tugmalar bilan qoladi. Mini Appni ochish uchun botga private chatda yozing:

```text
/app
```

State qayerga yoziladi:

- `MINI_APP_CHAT_ID` bo'lmasa, qazo va namoz state `PRAYER_CHAT_ID` yoki `TELEGRAM_CHAT_ID` bo'yicha ishlaydi.
- `MINI_APP_FITNESS_CHAT_ID` bo'lmasa, fitness checklist ham shu chat ID bo'yicha ishlaydi.
- Hammasi `CHECKLIST_STATE` KV binding ichida saqlanadi.
- Fitness checklist har sana uchun alohida saqlanadi. Masalan, 1-kunda belgilangan bandlar 2-kunga o'tib ketmaydi.
- Tasbeh umumiy sanog'i ham `CHECKLIST_STATE` ichida saqlanadi va ertasi kuni ham davom etadi.

## Namoz eslatmalari

Namoz moduli Cloudflare Worker scheduled trigger orqali ishlaydi. Worker har bir cron chaqiruvida bugungi namoz vaqti kirgan-kirmaganini tekshiradi.

Ishlash tartibi:

- Namoz vaqti kirsa, bot `PRAYER_CHAT_ID` ichidagi `PRAYER_TOPIC_ID` topicga eslatma yuboradi.
- Eslatma ichida `✅ O'qidim` va `➕ Qazo bo'ldi` tugmalari bor.
- `✅ O'qidim` bosilsa, eslatma xabari qoladi va shu namoz uchun qayta eslatma to'xtaydi.
- `➕ Qazo bo'ldi` bosilsa, shu namoz qazo hisobiga +1 qo'shiladi va eslatma to'xtaydi. Xufton uchun bu Xufton + Vitr qazo hisobini oshiradi.
- Agar belgilamasangiz, keyingi eslatma yuborilganda oldingi eslatma o'chiriladi. Chatda eslatmalar ko'payib ketmaydi.
- Bir vaqtning o'zida faqat bitta aktiv namoz eslatmasi turadi.
- Keyingi namoz vaqti kirganda oldingi namoz `O'qidim` deb belgilanmagan bo'lsa, u avtomatik qazo hisobiga qo'shiladi.
- Bomdod uchun muddat quyosh chiqishigacha. Quyosh chiqqandan keyin Bomdod eslatmasi kelmaydi va Bomdod qazo hisobiga qo'shiladi.
- Xufton keyingi kundagi Bomdodgacha eslatilishi mumkin. Agar keyingi Bomdod kirganda Xufton belgilanmagan bo'lsa, Xufton + Vitr qazo hisobiga qo'shiladi.
- Qazo hisoblari `CHECKLIST_STATE` KV ichida doimiy saqlanadi.

### Namoz topici

1. Telegram supergroup ichida yangi topic yarating, masalan `Namoz`.
2. Shu topic ichida yozing:

```text
/threadid
```

3. Bot qaytargan `Topic / thread ID` qiymatini Cloudflare Worker variable sifatida qo'shing:

```text
PRAYER_TOPIC_ID=thread_id
```

4. Namoz xabarlari borishi kerak bo'lgan chat ID ni qo'shing:

```text
PRAYER_CHAT_ID=-1002781399618
```

5. `TELEGRAM_ALLOWED_CHAT_IDS` ichida shu group ID ham borligiga ishonch hosil qiling:

```text
TELEGRAM_ALLOWED_CHAT_IDS=8084782034,-1002781399618
```

### Cron Trigger

Namoz eslatmalari avtomatik kelishi uchun Cloudflare'da cron kerak.

Dashboard orqali:

1. Worker -> **Settings** -> **Triggers** ga kiring.
2. **Add Cron Trigger** bosing.
3. Cron qiymatini yozing:

```text
*/5 * * * *
```

Bu Worker'ni har 5 daqiqada ishga tushiradi. Eslatma intervalini `PRAYER_REMINDER_INTERVAL_MINUTES=10` qilib qo'ysangiz, bir namoz uchun xabar 10 daqiqadan tez qayta chiqmaydi.

### Qazo panel

`/qazo` buyrug'i qazo dashboard xabarini yaratadi yoki mavjudini yangilaydi. Bot uni pin qilishga urinadi. Pin ishlashi uchun bot group admin bo'lishi va `Pin messages` ruxsatiga ega bo'lishi kerak.

Qazo hisobini qo'lda kiritish:

```text
/qazo_set bomdod 10
/qazo_set peshin 3
/qazo_add asr 1
/qazo_minus shom 1
/qazo_set vitr 5
```

Bot ishga tushishidan oldingi qazo sonlari ko'p bo'lsa, hammasini bitta xabarda kiritish mumkin:

```text
/qazo_bulk bomdod=120 peshin=80 asr=75 shom=70 xufton=60 vitr=60
```

Qazo paneldagi `✏️ Qo'lda kiritish` tugmasi shu format uchun tayyor namuna yuboradi.

Qabul qilinadigan nomlar:

```text
bomdod, peshin, asr, shom, xufton, vitr
```

Namoz vaqtlari asosiy manba sifatida `https://namoz-vaqti.uz/index.php` API orqali olinadi.

Ishlatiladigan endpoint:

```text
https://namoz-vaqti.uz/index.php?format=json&lang=lotin&period=2026-07&region=toshkent-shahri
```

Bot aniq oy JSON’ini oladi va kerakli sanani `period_table` ichidan topadi. API vaqtincha ishlamasa, bot AlAdhan fallback manbaga o'tadi. Fallbackni o'chirish kerak bo'lsa:

```text
PRAYER_DISABLE_FALLBACK=1
```

Agar internet/API ishlamasa yoki vaqtlarni qo'lda berishni xohlasangiz, Cloudflare variable sifatida quyidagini qo'shish mumkin:

```text
PRAYER_TIMES=bomdod=03:31,quyosh=05:05,peshin=12:29,asr=17:39,shom=19:52,xufton=21:28
```

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

Test natijalari:

- Saved Messages / self chat: `messages must not be sent to self`
- Bot chat: `BUSINESS_PEER_INVALID`
- Private group / supergroup: `chat must be a private chat`

Shuning uchun asosiy flow inline checklistga o'tkazildi. Inline checklist Telegram native kartasi emas, lekin har bir band alohida tugma sifatida bosiladi va xabar edit bo'lib `☐` / `✅` holati yangilanadi.

## Checklist holatini saqlash

`/today` qayta chaqirilganda oldingi belgilangan bandlar yo'qolmasligi uchun Cloudflare KV kerak.

Cloudflare Worker ichida:

1. **Storage & Databases** -> **KV** orqali namespace yarating: `fitness_checklist_state`
2. Worker -> **Settings** -> **Bindings** -> **Add binding**
3. Binding type: **KV Namespace**
4. Variable name: `CHECKLIST_STATE`
5. KV namespace: `fitness_checklist_state`
6. **Save and deploy**

Shundan keyin bot har chat va har sana uchun checklist holatini 90 kun saqlaydi.

`/reset` bugungi checklistni tozalaydi.
`/tomorrow` ertangi checklistni alohida holat bilan yuboradi.
Checklist tugmalarida `✅ Hammasi` va `♻️ Reset` bor.

## Supergroup topic

Telegram supergroup ichidagi aniq topic'ga yozish uchun `message_thread_id` kerak.

1. Kerakli topic ichiga kiring.
2. Shu topic ichida yozing:

```text
/threadid
```

3. Bot qaytargan `Topic / thread ID` qiymatini Cloudflare Worker variable sifatida qo'shing:

```text
TELEGRAM_TOPIC_ID=thread_id
```

Shundan keyin botning yangi xabarlari shu topic ichiga yuboriladi. General topic uchun odatda thread ID bo'lmaydi.

Tekshirish:

```text
/status
```

Javobda `KV CHECKLIST_STATE: ulangan` chiqishi kerak. Agar `ulanmagan` chiqsa, binding nomi noto'g'ri yozilgan yoki Worker qayta deploy qilinmagan.

Private group test:

1. Telegram'da yangi private group yarating.
2. @Ozish8haftabot ni group'ga qo'shing.
3. Group ichida `/chatid` yozing.
4. Bot qaytargan negative chat ID qiymatini Cloudflare'da `NATIVE_CHECKLIST_CHAT_ID` ga yozing.
5. `TELEGRAM_ALLOWED_CHAT_IDS` ichiga shaxsiy chat ID va group ID ni vergul bilan yozing.
6. Botga `/today` yozib native checklistni test qiling.
