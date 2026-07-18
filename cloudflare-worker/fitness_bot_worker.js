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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildWorkoutMessage(targetDate, env) {
  const startDate = parseDate(env.FITNESS_START_DATE || "2026-07-19");
  const dayIndex = Math.floor((dateOnly(targetDate) - dateOnly(startDate)) / 86400000);

  if (dayIndex < 0) {
    return `⏳ <b>Reja hali boshlanmagan</b>\n\nStart sanasi: <code>${formatDate(startDate)}</code>`;
  }
  if (dayIndex >= 56) {
    return "🏁 <b>8 haftalik reja tugadi</b>\n\nBugun progressni ko'rib chiqish va yangi bosqichni tanlash kuni.";
  }

  const weekIndex = Math.floor(dayIndex / 7);
  const dayInWeek = dayIndex % 7;

  return [
    `🔥 <b>${weekIndex + 1}-hafta, ${dayInWeek + 1}-kun</b>`,
    `<code>${formatDate(targetDate)}</code>`,
    "",
    `🎯 <b>Bugungi reja</b>`,
    `• ${escapeHtml(PLAN[weekIndex][dayInWeek])}`,
    `• Treadmill: <b>${escapeHtml(TREADMILL_SETTINGS[weekIndex])}</b>`,
    `• Zina: <b>${escapeHtml(STAIR_SETTINGS[weekIndex])}</b>`,
    "",
    "📌 <b>Tartib</b>",
    "☐ Warm-up: 5 daqiqa",
    "☐ Asosiy mashg'ulot",
    "☐ Cool-down: 3-5 daqiqa",
    "☐ Cho'zilish",
    "",
    "✅ <b>Checklist</b>",
    "☐ 3 litr suv",
    "☐ Oqsilga boy ovqat",
    "☐ 8-10 ming qadam",
    "☐ 7.5+ soat uyqu",
    "☐ Shirin ichimlik yo'q",
  ].join("\n");
}

function helpMessage() {
  return [
    "🤖 <b>Men 8 haftalik kardio reja botiman.</b>",
    "",
    "<b>Yozishingiz mumkin:</b>",
    "• /today yoki bugun - bugungi reja",
    "• /tomorrow yoki ertaga - ertangi reja",
    "• /help - buyruqlar",
  ].join("\n");
}

function workoutKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "✅ Bajarildi", callback_data: "done" },
        { text: "📋 Bugun", callback_data: "today" },
      ],
      [
        { text: "➡️ Ertaga", callback_data: "tomorrow" },
        { text: "ℹ️ Yordam", callback_data: "help" },
      ],
    ],
  };
}

async function sendTelegram(env, chatId, text, replyMarkup = null) {
  const body = { chat_id: chatId, text, parse_mode: "HTML" };
  if (replyMarkup) body.reply_markup = replyMarkup;

  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Telegram API failed: ${response.status}`);
  }
}

async function answerCallback(env, callbackQueryId, text) {
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
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
  return "Tushundim. Bugungi reja kerak bo'lsa, <b>/today</b> yoki <b>bugun nima qilishim kerak</b> deb yozing.";
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Fitness bot is running.");
    }

    const update = await request.json();
    const callback = update.callback_query;
    if (callback && callback.message && callback.data) {
      const chatId = callback.message.chat.id;
      if (env.TELEGRAM_CHAT_ID && String(chatId) !== String(env.TELEGRAM_CHAT_ID)) {
        await answerCallback(env, callback.id, "Bu bot shaxsiy foydalanish uchun sozlangan.");
        return new Response("OK");
      }

      if (callback.data === "done") {
        await answerCallback(env, callback.id, "Qabul qilindi. Bugungi odat saqlandi.");
      } else if (callback.data === "tomorrow") {
        await answerCallback(env, callback.id, "Ertangi reja yuborildi.");
        await sendTelegram(env, chatId, buildWorkoutMessage(tashkentDate(1), env), workoutKeyboard());
      } else if (callback.data === "help") {
        await answerCallback(env, callback.id, "Yordam yuborildi.");
        await sendTelegram(env, chatId, helpMessage(), workoutKeyboard());
      } else {
        await answerCallback(env, callback.id, "Bugungi reja yuborildi.");
        await sendTelegram(env, chatId, buildWorkoutMessage(tashkentDate(0), env), workoutKeyboard());
      }
      return new Response("OK");
    }

    const message = update.message;
    if (!message || !message.chat || !message.text) {
      return new Response("OK");
    }

    if (env.TELEGRAM_CHAT_ID && String(message.chat.id) !== String(env.TELEGRAM_CHAT_ID)) {
      await sendTelegram(env, message.chat.id, "Bu bot shaxsiy foydalanish uchun sozlangan.");
      return new Response("OK");
    }

    await sendTelegram(env, message.chat.id, responseFor(message.text, env), workoutKeyboard());
    return new Response("OK");
  },
};
