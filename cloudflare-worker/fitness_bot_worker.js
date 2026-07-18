const PLAN = [
  [
    "45 min treadmill + 10 min zina",
    "50 min treadmill",
    "40 min treadmill + 15 min zina",
    "50 min treadmill",
    "45 min treadmill + 15 min zina",
    "60 min treadmill",
    "Dam / 8-10k qadam",
  ],
  [
    "45 min treadmill + 15 min zina",
    "55 min treadmill",
    "40 min treadmill + 15 min zina",
    "55 min treadmill",
    "45 min treadmill + 20 min zina",
    "65 min treadmill",
    "Dam / 8-10k qadam",
  ],
  [
    "50 min treadmill + 15 min zina",
    "60 min treadmill",
    "45 min treadmill + 20 min zina",
    "60 min treadmill",
    "50 min treadmill + 20 min zina",
    "70 min treadmill",
    "Faol dam",
  ],
  [
    "50 min treadmill + 20 min zina",
    "60 min treadmill",
    "45 min treadmill + 20 min zina",
    "60 min treadmill",
    "50 min treadmill + 25 min zina",
    "75 min treadmill",
    "Dam",
  ],
  [
    "55 min treadmill + 20 min zina",
    "65 min treadmill",
    "50 min treadmill + 25 min zina",
    "65 min treadmill",
    "55 min treadmill + 25 min zina",
    "80 min treadmill",
    "Faol dam",
  ],
  [
    "55 min treadmill + 25 min zina",
    "70 min treadmill",
    "50 min treadmill + 25 min zina",
    "70 min treadmill",
    "55 min treadmill + 30 min zina",
    "85 min treadmill",
    "Dam",
  ],
  [
    "60 min treadmill + 25 min zina",
    "70 min treadmill",
    "55 min treadmill + 30 min zina",
    "70 min treadmill",
    "60 min treadmill + 30 min zina",
    "90 min treadmill",
    "Faol dam",
  ],
  [
    "60 min treadmill + 30 min zina",
    "75 min treadmill",
    "55 min treadmill + 30 min zina",
    "75 min treadmill",
    "60 min treadmill + 35 min zina",
    "90 min treadmill",
    "Dam",
  ],
];

const TREADMILL_SETTINGS = [
  "5.8-6.0 km/soat, incline 1-2%",
  "5.8-6.0 km/soat, incline 1-2%",
  "6.0-6.2 km/soat, incline 2-3%",
  "6.0-6.2 km/soat, incline 2-3%",
  "6.2-6.4 km/soat, incline 3-5%",
  "6.2-6.4 km/soat, incline 3-5%",
  "6.3-6.5 km/soat, incline 5-6%",
  "6.3-6.5 km/soat, incline 5-6%",
];

const STAIR_SETTINGS = [
  "Level 3-4",
  "Level 3-4",
  "Level 4-5",
  "Level 4-5",
  "Level 5-6",
  "Level 5-6",
  "Level 6-7",
  "Level 6-7",
];

function tashkentDate(offsetDays = 0) {
  const now = new Date();
  const tashkent = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tashkent" }));
  tashkent.setDate(tashkent.getDate() + offsetDays);
  return tashkent;
}

function dateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function buildWorkoutMessage(targetDate, env) {
  const startDate = parseDate(env.FITNESS_START_DATE || "2026-07-19");
  const dayIndex = Math.floor((dateOnly(targetDate) - dateOnly(startDate)) / 86400000);

  if (dayIndex < 0) {
    return `Reja hali boshlanmagan. Start sanasi: ${formatDate(startDate)}`;
  }
  if (dayIndex >= 56) {
    return "8 haftalik reja tugadi. Bugun progressni ko'rib chiqish va yangi bosqichni tanlash kuni.";
  }

  const weekIndex = Math.floor(dayIndex / 7);
  const dayInWeek = dayIndex % 7;

  return [
    `Bugun: ${formatDate(targetDate)}`,
    `${weekIndex + 1}-hafta, ${dayInWeek + 1}-kun`,
    "",
    `Reja: ${PLAN[weekIndex][dayInWeek]}`,
    `Treadmill: ${TREADMILL_SETTINGS[weekIndex]}`,
    `Zina: ${STAIR_SETTINGS[weekIndex]}`,
    "",
    "Tartib:",
    "- Warm-up: 5 daqiqa",
    "- Asosiy mashg'ulot",
    "- Cool-down: 3-5 daqiqa",
    "- Cho'zilish",
    "",
    "Checklist:",
    "- 3 litr suv",
    "- Oqsilga boy ovqat",
    "- 8-10 ming qadam",
    "- 7.5+ soat uyqu",
    "- Shirin ichimlik yo'q",
  ].join("\n");
}

function helpMessage() {
  return [
    "Men 8 haftalik kardio reja botiman.",
    "",
    "Yozishingiz mumkin:",
    "/today yoki bugun - bugungi reja",
    "/tomorrow yoki ertaga - ertangi reja",
    "/help - buyruqlar",
  ].join("\n");
}

async function sendTelegram(env, chatId, text) {
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!response.ok) {
    throw new Error(`Telegram API failed: ${response.status}`);
  }
}

function responseFor(text, env) {
  const normalized = text.toLowerCase().trim();
  if (normalized === "/start" || normalized === "/help" || normalized.includes("yordam")) {
    return helpMessage();
  }
  if (normalized === "/tomorrow" || normalized.includes("ertaga")) {
    return buildWorkoutMessage(tashkentDate(1), env);
  }
  if (
    normalized === "/today" ||
    normalized.includes("bugun") ||
    normalized.includes("nima qilish") ||
    normalized.includes("mashq")
  ) {
    return buildWorkoutMessage(tashkentDate(0), env);
  }
  return "Tushundim. Bugungi reja kerak bo'lsa, /today yoki \"bugun nima qilishim kerak\" deb yozing.";
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Fitness bot is running.");
    }

    const update = await request.json();
    const message = update.message;
    if (!message || !message.chat || !message.text) {
      return new Response("OK");
    }

    if (env.TELEGRAM_CHAT_ID && String(message.chat.id) !== String(env.TELEGRAM_CHAT_ID)) {
      await sendTelegram(env, message.chat.id, "Bu bot shaxsiy foydalanish uchun sozlangan.");
      return new Response("OK");
    }

    await sendTelegram(env, message.chat.id, responseFor(message.text, env));
    return new Response("OK");
  },
};
