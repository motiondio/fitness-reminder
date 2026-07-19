# Kaiten Mini App bot loyihasi

Bog'liq notelar:

- [[Fitness bot loyihasi]]
- [[README]]

## Maqsad

Telegram Mini App orqali Kaiten shooting boardini boshqarish:

- Yangi syomka card yaratish
- Cardlarni 3 ustun bo'yicha ko'rish
- Card title va asosiy ma'lumotlarini edit qilish
- Cardni ustunlar orasida o'tkazish
- Yangi mijozni Google Sheets mijozlar bazasiga qo'shish
- Mini Appdan faqat ro'yxatdan o'tgan userlar foydalanishi

## Joriy status

Cloudflare Worker scaffold qilindi:

- `kaiten-worker/kaiten_bot_worker.js`
- `wrangler.kaiten.jsonc`
- `kaiten-worker/README.md`

Secretlar repo ichiga yozilmagan. Ular faqat Cloudflare secret sifatida qo'shiladi.

Keyingi amaliy qadamlar:

1. `KAITEN_STATE` KV namespace yaratish
2. `wrangler.kaiten.jsonc` ichiga KV `id` yozish
3. `TELEGRAM_BOT_TOKEN`, `KAITEN_API_TOKEN`, `GOOGLE_SERVICE_ACCOUNT_JSON` secretlarini qo'shish
4. `npm run deploy:kaiten` bilan deploy qilish
5. Telegram webhook va Mini App menu buttonni yangi Worker URLga ulash

Oxirgi takomillashtirishlar:

- Telegram `/start`, `/app`, `/menu` komandalarida menu button avtomatik `/app` URLga yangilanadi.
- `/health` endpoint deploy versiyasini va binding/secret bor-yo'qligini ko'rsatadi.
- Mavjud Kaiten card title ichidan icon, sana, vaqt va mijoz nomi ajratib olinadi.
- Edit rejimida parsing ishlamasa ham column move date/time bo'shligi sabab bloklanmaydi.
- Mijozlar bazasi `MIJOZLAR BAZASI!A6:X1000` dan olinadi.
- Mijozlar ro'yxati Cloudflare KV cachega saqlanadi va har 30 daqiqada cron bilan yangilanadi.
- Mini App ichida `Mijozlar bazasini yangilash` tugmasi bor.
- `GOOGLE_SERVICE_ACCOUNT_JSON` Cloudflare tarafida JSON object bo'lib kelsa ham qabul qilinadi.
- Cardni uzoq bosib turib boshqa ustunga drag qilish qo'shildi.
- Yangi zakaz qo'shilganda riser synth sound va haptic feedback qo'shildi.
- Fixed compact UI qo'shildi: scale sozlamasisiz, odatdagidan taxminan 7% kichikroq.
- `Auto`, `Dark`, `White` theme sozlamalari qo'shildi.
- Card boxlar title va mijoz pilllariga mos balandlashadigan qilindi.
- Card drag paytida board horizontal scroll vaqtincha bloklanadigan qilindi.
- Yangi mijoz qo'shishda mavjud mijoz inputi majburiy bo'lmaydigan va card title ism/familiyadan yig'iladigan qilindi.
- Cardlar Telegram iOS WebView'da balandlik buzilmasligi uchun button emas, clickable article sifatida render qilinadigan qilindi.

## Platforma

- Mini App faqat Telegram bot ichida ochiladi.
- Kaiten ichidan Mini App ochilmaydi.
- Backend uchun eng mos variant: Cloudflare Worker.
- Fitness botdan alohida yangi Cloudflare Worker yaratiladi.
- Tavsiya qilingan Worker nomi: `kaiten-miniapp-bot`.
- State va whitelist uchun: Cloudflare KV yoki D1.
- Secretlar:
  - `TELEGRAM_BOT_TOKEN`
  - `KAITEN_API_TOKEN`
  - `GOOGLE_SERVICE_ACCOUNT_JSON`
  - `GOOGLE_SHEET_ID`

Secretlarni note yoki git repo ichiga yozmaymiz. Hammasi Cloudflare Worker secret/variable sifatida saqlanadi.

## Kaiten sozlamalari

Domain:

```text
isoomedia.kaiten.ru
```

Board:

```text
725343
```

Lane:

```text
Lane yo'q, cardlar lane_id bermasdan yaratiladi.
```

Columns:

```text
Shooting day: 2596315
Shooting process: 2596316
DONE: 2596317
```

Mini Appdagi ustunlar aynan shu ketma-ketlikda chiqadi:

1. Shooting day
2. Shooting process
3. DONE

## Yangi card yaratish oqimi

`Shooting day` ustuni yuqorisida `+ Yangi syomka` form bo'ladi.

Form maydonlari:

- Icon / kombinatsiya
- Sana
- Vaqt yoki vaqt oralig'i
- Mijoz
- Yangi mijoz qo'shish

Card title format:

```text
⭐️18-Iyul 16:00 Timur aka Mfaktor
```

Yoki vaqt oralig'i bo'lsa:

```text
🚚🟢19-Iyul 14:00-17:00 Abdulaziz Ataullayev (Omega)
```

Card Kaiten'da `Shooting day` column ichida yaratiladi va Mini Appda darhol ko'rinadi.

## Icon tizimi

Asosiy ishlar:

- `⭐️` - Syomka
- `✂️` - Montaj

Yo'nalishlar:

- `🟢` - Reels
- `🔴` - Podcast
- `🟡` - YouTube
- `⭐️` - Studio ijarasi
- `📷` - Fotosessiya
- `💻` - Vebinar
- `🏛️` - Seminar

Modifierlar:

- `🚚` - Vyezdnoy
- `🧤` - Rekomendatsiyadan kelgan
- `🎯` - Target orqali yangi mijoz

Kombinatsiya misollari:

- `⭐️🟢` - Syomka + Reels
- `🟢` - Podklyuch + Reels
- `✂️🟢` - Montaj + Reels
- `🚚⭐️🔴` - Syomka vyezdnoy + Podcast
- `🧤🟡` - Podklyuch + YouTube + yangi mijoz

## Google Sheets mijozlar bazasi

Spreadsheet:

```text
1wQKc0kCXrnWrt-lqqg8oYXRBO6ai7LaiH8BlEthpr6U
```

Sheet:

```text
MIJOZLAR BAZASI
```

Ustunlar:

- `A` - Mijoz ism familiyasi
- `V` - Sohasi yoki kompaniyasi
- `W` - Telefon raqami
- `X` - Qo'shimcha izoh

Yangi mijoz qo'shish:

1. `Yangi mijoz` tugmasi bosiladi.
2. Maydonlar chiqadi:
   - Ism
   - Familiya
   - Telefon raqami
   - Sohasi yoki kompaniyasi
   - Qo'shimcha izoh
3. Saqlanganda `MIJOZLAR BAZASI` sheetidagi keyingi bo'sh qatorga yoziladi.
4. Yangi mijoz formdagi mijoz tanloviga avtomatik tanlanadi.

## Access control

Mini Appdan faqat whitelistdagi Telegram userlar foydalanadi.

Owner Telegram user ID:

```text
8084782034
```

Role modeli:

- `owner` - bot egasi, whitelistni boshqaradi, hamma narsani ko'radi
- `admin` - user qo'shishi/o'chirishi mumkin
- `editor` - card yaratadi, edit qiladi, move qiladi
- `viewer` - faqat ko'radi

Whitelist boshqa userlarga ko'rinmaydi.

Admin panel faqat `owner/admin` userlarda ko'rinadi.

Admin funksiyalari:

- User qo'shish
- User o'chirish
- Role almashtirish
- Access log ko'rish

## Mini App ekranlari

### Board

3 ustunli board:

- Desktop: 3 column yonma-yon
- Telefon: columnlar horizontal swipe bilan yoki tab orqali

Card ko'rinishi Kaitenga yaqin bo'ladi:

- Dark card
- Title
- Mijoz label
- Mas'ul label
- Comment icon / count bo'lsa ko'rsatish

### New Shooting

Yangi card form:

- Icon picker
- Sana picker
- Vaqt picker
- Mijoz autocomplete
- Yangi mijoz modal
- Preview title
- `Kaitenga qo'shish` tugmasi

### Card Detail

Cardni kengaytirilgan edit qilish:

- Title
- Icon
- Sana
- Vaqt
- Mijoz
- Column
- Comment qo'shish
- Kaiten card linkini ochish

Kaiten descriptionga hozircha yozilmaydi.

Keyingi bosqichda Telegram orqali kengaytirilgan o'zgarishlar:

- Card comment qo'shish
- Checklist qo'shish
- Mas'ul biriktirish
- Deadline qo'yish
- Mijoz ma'lumotini yangilash

## API endpointlar

Worker endpointlari:

- `GET /app`
- `GET /api/state`
- `GET /api/cards`
- `POST /api/cards`
- `PATCH /api/cards/:id`
- `POST /api/cards/:id/move`
- `GET /api/clients`
- `POST /api/clients`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/:telegram_id`
- `DELETE /api/admin/users/:telegram_id`

## Kaiten API ishlatiladigan joylar

- Card yaratish
- Card ro'yxatini olish
- Card title/update qilish
- Cardni columnlar orasida o'tkazish
- Card comment qo'shish
- Keyinroq card checklist/assignee/deadline

## Google API ishlatiladigan joylar

- `MIJOZLAR BAZASI!A6:X1000` dan mijozlar ro'yxatini o'qish
- Yangi mijoz uchun keyingi bo'sh qatorni topish
- `A`, `V`, `W`, `X` ustunlariga yozish

Google auth:

- API key emas, Service Account ishlatiladi.
- `Google Sheets API` yoqiladi.
- Service Account yaratiladi.
- Service Account uchun JSON key olinadi.
- Spreadsheet service account emailiga `Editor` qilib share qilinadi.
- JSON key Cloudflare secret sifatida `GOOGLE_SERVICE_ACCOUNT_JSON` nomi bilan saqlanadi.

Service Account email:

```text
kaiten-miniapp-sheets@copper-citron-421112.iam.gserviceaccount.com
```

## MVP

1. Telegram Mini App auth va whitelist
2. Kaiten cardlarni 3 column bo'yicha ko'rsatish
3. Yangi card yaratish
4. Mijoz autocomplete (`A6:A1000` nomlar, `V/W` qo'shimcha ma'lumot)
5. Yangi mijozni Google Sheetsga qo'shish
6. Card title edit
7. Cardni columnlar orasida move qilish
8. Admin panel: whitelist boshqarish

## Keyingi funksiyalar

- Bugungi syomkalar view
- Ertangi syomkalar Telegram xabarnomasi
- Duplicate warning: bir xil mijoz + sana + vaqt
- Syomka turi bo'yicha filter
- Mijoz tarixi
- O'zgarishlar logi
- Card commentlari
- Mas'ullar va rangli label mapping
- Kaiten webhook yoki polling orqali real-time sync

## Ochiq savollar

- Kaiten boardda `lane_id` bormi yoki cardlar default lane ichida yaratiladimi?
- Card label/ranglar API orqali boshqariladimi yoki faqat title bilan ishlaymizmi?
- Mas'ul odamlar ro'yxati Kaiten userlaridan olinadimi yoki Mini App ichida alohida bo'ladimi?
- Mijoz autocomplete uchun Google Sheetsdan har safar o'qiymizmi yoki KV cache qilamizmi?
- Real-time sync uchun Kaiten webhook bormi, yoki 10-20 soniyada polling yetarlimi?
