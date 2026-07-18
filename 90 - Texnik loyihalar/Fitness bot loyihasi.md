# Fitness bot loyihasi

Bog'liq notelar:

- [[Fitness xabarnoma agenti]]
- [[8 haftalik kardio reja]]

## Kod joylashuvi

- `cloudflare-worker/fitness_bot_worker.js` - interaktiv Telegram webhook bot
- `cloudflare-worker/README.md` - Cloudflare Worker bo'yicha qo'llanma
- `.github/workflows/fitness-reminder.yml` - har kuni 05:00 Telegram eslatma
- `tools/fitness_reminder.py` - daily reminder script
- `tools/install_fitness_reminder.py` - macOS lokal agent o'rnatish scripti

## Joriy status

- Telegram webhook ulangan
- Worker URL: `https://fitness-reminder.shahzod-rmusic.workers.dev/`
- Daily reminder: GitHub Actions orqali 05:00 Asia/Tashkent
- Business / Secretary Mode: ulangan
- Native checklist: `BUSINESS_CONNECTION_ID` Cloudflare variable sifatida qo'shilgandan keyin `/today` va `/checklist` uchun ishlaydi
- Native checklist target: `8967190826`
- Allowed chat IDs: `8084782034,-1002781399618`
- Native checklist cheklovi: self, bot chat va group uchun Telegram API rad etdi
- Asosiy flow: inline bosiladigan checklist
- Checklist state: Cloudflare KV binding `CHECKLIST_STATE` kerak
- Diagnostika: `/status`
- `/tomorrow` ham inline checklist yuboradi va ertangi sana uchun alohida state saqlaydi
- Checklist tugmalari: task toggle, `✅ Hammasi`, `♻️ Reset`

## Keyingi bosqichlar

- Business / Secretary Mode orqali native Telegram checklistni yakunlash
- `BUSINESS_CONNECTION_ID` ni Cloudflare Worker variable sifatida qo'shish
- Private group ID ni `/chatid` orqali topib, `NATIVE_CHECKLIST_CHAT_ID` ga yozish
- AI'siz aqlli komandalarni kengaytirish
- OpenAI API yoki bepul alternativani keyinroq ulash
- Progress loglarini [[8 haftalik kardio reja]] bilan bog'lash
