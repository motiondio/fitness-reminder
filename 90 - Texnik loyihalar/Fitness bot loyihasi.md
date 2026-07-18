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
- Native checklist target: `@Ozish8haftabot`

## Keyingi bosqichlar

- Business / Secretary Mode orqali native Telegram checklistni yakunlash
- `BUSINESS_CONNECTION_ID` ni Cloudflare Worker variable sifatida qo'shish
- AI'siz aqlli komandalarni kengaytirish
- OpenAI API yoki bepul alternativani keyinroq ulash
- Progress loglarini [[8 haftalik kardio reja]] bilan bog'lash
