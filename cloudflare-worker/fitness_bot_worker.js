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

const PRAYERS = [
  { key: "fajr", apiKey: "Fajr", label: "Bomdod", aliases: ["bomdod", "fajr"] },
  { key: "dhuhr", apiKey: "Dhuhr", label: "Peshin", aliases: ["peshin", "zuhur", "dhuhr"] },
  { key: "asr", apiKey: "Asr", label: "Asr", aliases: ["asr"] },
  { key: "maghrib", apiKey: "Maghrib", label: "Shom", aliases: ["shom", "maghrib"] },
  { key: "isha", apiKey: "Isha", label: "Xufton", aliases: ["xufton", "hufton", "isha"] },
];

const QAZO_PRAYERS = [
  ...PRAYERS,
  { key: "witr", label: "Vitr", aliases: ["vitr", "witr"] },
];

const TASBEH_ZIKRS = [
  { text: "Subhanalloh", note: "Alloh har qanday nuqsondan pok." },
  { text: "Alhamdulillah", note: "Hamd va shukr Allohgadir." },
  { text: "Allohu akbar", note: "Alloh eng buyuk." },
  { text: "La ilaha illalloh", note: "Allohdan boshqa iloh yo'q." },
  { text: "Astag'firulloh", note: "Allohdan mag'firat so'rash." },
  { text: "Subhanallohi va bihamdihi", note: "Poklik va hamd Allohga." },
  { text: "Subhanallohil azim", note: "Ulug' Alloh pokdir." },
  { text: "La hawla va la quwwata illa billah", note: "Kuch-quvvat faqat Allohdandir." },
  { text: "Allohumma solli ala Muhammad", note: "Payg'ambarimizga salovat." },
  { text: "Hasbiyallohu la ilaha illa Huwa", note: "Menga Alloh kifoya." },
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

function tashkentNowParts() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(new Date())
    .reduce((result, part) => {
      if (part.type !== "literal") {
        result[part.type] = part.value;
      }
      return result;
    }, {});

  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  return {
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    hour,
    minute,
    minutes: hour * 60 + minute,
  };
}

function dateFromCallback(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? parseDate(value) : tashkentDate(0);
}

function dateFromMiniApp(value) {
  if (value instanceof Date) {
    return value;
  }
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) ? parseDate(value) : tashkentDate(0);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function normalizeCommand(text) {
  const parts = String(text || "").toLowerCase().trim().split(/\s+/);
  if (parts[0]) {
    parts[0] = parts[0].split("@")[0];
  }
  return parts.join(" ");
}

function prayerByName(value) {
  const normalized = String(value || "").toLowerCase().trim();
  return QAZO_PRAYERS.find((prayer) => prayer.aliases.includes(normalized)) || null;
}

function prayerChatId(env) {
  return env.PRAYER_CHAT_ID || env.NATIVE_CHECKLIST_CHAT_ID || env.TELEGRAM_CHAT_ID || null;
}

function prayerThreadId(env, fallbackThreadId = null) {
  return Number(env.PRAYER_TOPIC_ID || fallbackThreadId || env.TELEGRAM_TOPIC_ID || 0) || null;
}

function prayerReminderIntervalMinutes(env) {
  return Math.max(1, Number(env.PRAYER_REMINDER_INTERVAL_MINUTES || 10));
}

function prayerSource(env) {
  return String(env.PRAYER_SOURCE || "namozvaqti").toLowerCase().trim();
}

function prayerRegion(env) {
  return env.PRAYER_REGION || env.PRAYER_CITY || "toshkent-shahri";
}

function namozVaqtiRegion(env) {
  return String(env.PRAYER_REGION_SLUG || prayerRegion(env) || "toshkent-shahri")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
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

function workoutPlanFor(targetDate, env) {
  const startDate = parseDate(env.FITNESS_START_DATE || "2026-07-19");
  const dayIndex = Math.floor((dateOnly(targetDate) - dateOnly(startDate)) / 86400000);
  if (dayIndex < 0 || dayIndex >= 56) {
    return null;
  }

  const weekIndex = Math.floor(dayIndex / 7);
  const dayInWeek = dayIndex % 7;
  return {
    title: `${weekIndex + 1}-hafta, ${dayInWeek + 1}-kun`,
    workout: PLAN[weekIndex][dayInWeek],
    treadmill: TREADMILL_SETTINGS[weekIndex],
    stair: STAIR_SETTINGS[weekIndex],
  };
}

function buildNativeChecklist(targetDate, env) {
  const plan = workoutPlanFor(targetDate, env);
  if (!plan) {
    return {
      title: "8 haftalik reja",
      tasks: [{ id: 1, text: "Progressni ko'rib chiqish" }],
      others_can_add_tasks: false,
      others_can_mark_tasks_as_done: true,
    };
  }

  return {
    title: plan.title,
    tasks: [
      { id: 1, text: "Warm-up: 5 daqiqa" },
      { id: 2, text: plan.workout.slice(0, 100) },
      { id: 3, text: `Treadmill: ${plan.treadmill}`.slice(0, 100) },
      { id: 4, text: `Zina: ${plan.stair}`.slice(0, 100) },
      { id: 5, text: "Cool-down: 3-5 daqiqa" },
      { id: 6, text: "Cho'zilish" },
      { id: 7, text: "3 litr suv" },
      { id: 8, text: "Oqsilga boy ovqat" },
      { id: 9, text: "8-10 ming qadam" },
      { id: 10, text: "7.5+ soat uyqu" },
      { id: 11, text: "Shirin ichimlik yo'q" },
    ],
    others_can_add_tasks: false,
    others_can_mark_tasks_as_done: true,
  };
}

function checklistTasks(targetDate, env) {
  const plan = workoutPlanFor(targetDate, env);
  if (!plan) {
    return ["Progressni ko'rib chiqish"];
  }

  return [
    "Warm-up: 5 daqiqa",
    plan.workout,
    `Treadmill: ${plan.treadmill}`,
    `Zina: ${plan.stair}`,
    "Cool-down: 3-5 daqiqa",
    "Cho'zilish",
    "3 litr suv",
    "Oqsilga boy ovqat",
    "8-10 ming qadam",
    "7.5+ soat uyqu",
    "Shirin ichimlik yo'q",
  ];
}

function buildInlineChecklistText(targetDate, env, mask = 0) {
  const plan = workoutPlanFor(targetDate, env);
  const title = plan ? plan.title : "8 haftalik reja";
  const tasks = checklistTasks(targetDate, env);
  const completedCount = tasks.filter((_, index) => Boolean(mask & (1 << index))).length;
  const storageLine = env.CHECKLIST_STATE
    ? "Saqlash: KV ulangan"
    : "Saqlash: KV ulanmagan, /today qayta chaqirilsa reset bo'ladi";

  return [
    `✅ <b>${escapeHtml(title)}</b>`,
    `<code>${formatDate(targetDate)}</code>`,
    `<i>${escapeHtml(storageLine)}</i>`,
    "",
    ...tasks.map((task, index) => `${mask & (1 << index) ? "✅" : "☐"} ${escapeHtml(task)}`),
    "",
    `<b>${completedCount} / ${tasks.length} bajarildi</b>`,
  ].join("\n");
}

function checklistKey(chatId, targetDate) {
  return `checklist:${chatId}:${formatDate(targetDate)}`;
}

async function getChecklistMask(env, chatId, targetDate) {
  if (!env.CHECKLIST_STATE) {
    return 0;
  }
  const value = await env.CHECKLIST_STATE.get(checklistKey(chatId, targetDate));
  return Number(value || 0);
}

async function setChecklistMask(env, chatId, targetDate, mask) {
  if (!env.CHECKLIST_STATE) {
    return;
  }
  await env.CHECKLIST_STATE.put(checklistKey(chatId, targetDate), String(mask), {
    expirationTtl: 60 * 60 * 24 * 90,
  });
}

async function kvGet(env, key, fallback = null) {
  if (!env.CHECKLIST_STATE) {
    return fallback;
  }
  const value = await env.CHECKLIST_STATE.get(key);
  return value ?? fallback;
}

async function kvPut(env, key, value, ttlSeconds = 60 * 60 * 24 * 365) {
  if (!env.CHECKLIST_STATE) {
    return;
  }
  await env.CHECKLIST_STATE.put(key, String(value), { expirationTtl: ttlSeconds });
}

async function kvDelete(env, key) {
  if (!env.CHECKLIST_STATE) {
    return;
  }
  await env.CHECKLIST_STATE.delete(key);
}

function inlineChecklistKeyboard(targetDate, env, mask = 0) {
  const tasks = checklistTasks(targetDate, env);
  const dateKey = formatDate(targetDate);
  const allMask = (1 << tasks.length) - 1;
  const rows = tasks.map((task, index) => [
    {
      text: `${mask & (1 << index) ? "✅" : "☐"} ${task.slice(0, 32)}`,
      callback_data: `tgl:${dateKey}:${mask}:${index}`,
    },
  ]);
  rows.push([
    { text: "✅ Hammasi", callback_data: `all:${dateKey}:${allMask}` },
    { text: "♻️ Reset", callback_data: `rst:${dateKey}` },
  ]);
  return { inline_keyboard: rows };
}

function helpMessage() {
  return [
    "🤖 <b>8 haftalik marafon bot</b>",
    "",
    "<b>Asosiy buyruqlar:</b>",
    "• /app - Telegram Mini App",
    "• /today - bugungi bosiladigan checklist",
    "• /checklist - bugungi bosiladigan checklist",
    "• /tomorrow - ertangi reja",
    "• /reset - bugungi checklistni tozalash",
    "• /chatid - joriy chat ID",
    "• /threadid - joriy topic ID",
    "• /status - bot sozlamalarini tekshirish",
    "• /namoz - bugungi namoz vaqtlari",
    "• /qazo - qazo panel",
    "• /qazo_set bomdod 10 - qazo sonini qo'lda kiritish",
    "• /qazo_bulk bomdod=10 peshin=10 asr=10 shom=10 xufton=10 vitr=10",
    "• /help - yordam",
    "",
    "Progress saqlanishi uchun Cloudflare KV binding kerak: <code>CHECKLIST_STATE</code>.",
  ].join("\n");
}

function statusMessage(env, chatId) {
  return [
    "⚙️ <b>Bot status</b>",
    "",
    `Chat ID: <code>${escapeHtml(chatId)}</code>`,
    `KV CHECKLIST_STATE: <b>${env.CHECKLIST_STATE ? "ulangan" : "ulanmagan"}</b>`,
    `BUSINESS_CONNECTION_ID: <b>${env.BUSINESS_CONNECTION_ID ? "bor" : "yo'q"}</b>`,
    `NATIVE_CHECKLIST_CHAT_ID: <code>${escapeHtml(env.NATIVE_CHECKLIST_CHAT_ID || "yo'q")}</code>`,
    `TELEGRAM_ALLOWED_CHAT_IDS: <code>${escapeHtml(env.TELEGRAM_ALLOWED_CHAT_IDS || "yo'q")}</code>`,
    `TELEGRAM_TOPIC_ID: <code>${escapeHtml(env.TELEGRAM_TOPIC_ID || "yo'q")}</code>`,
    `PRAYER_CHAT_ID: <code>${escapeHtml(prayerChatId(env) || "yo'q")}</code>`,
    `PRAYER_TOPIC_ID: <code>${escapeHtml(env.PRAYER_TOPIC_ID || "yo'q")}</code>`,
    `PRAYER_SOURCE: <code>${escapeHtml(prayerSource(env))}</code>`,
    `PRAYER_REGION: <code>${escapeHtml(prayerRegion(env))}</code>`,
    `PRAYER_REGION_SLUG: <code>${escapeHtml(namozVaqtiRegion(env))}</code>`,
    `PRAYER_CITY: <code>${escapeHtml(env.PRAYER_CITY || "Tashkent")}</code>`,
    `PRAYER_COUNTRY: <code>${escapeHtml(env.PRAYER_COUNTRY || "Uzbekistan")}</code>`,
    `PRAYER_REMINDER_INTERVAL_MINUTES: <code>${escapeHtml(prayerReminderIntervalMinutes(env))}</code>`,
    `PRAYER_TIMES: <b>${env.PRAYER_TIMES ? "manual" : "API"}</b>`,
    `MINI_APP_URL: <code>${escapeHtml(env.MINI_APP_URL || "/app")}</code>`,
    `MINI_APP_CHAT_ID: <code>${escapeHtml(miniAppChatId(env) || "yo'q")}</code>`,
    "",
    env.CHECKLIST_STATE
      ? "Checklist holati /today qayta chaqirilganda saqlanishi kerak."
      : "Cloudflare KV binding qo'shilmagan: CHECKLIST_STATE nomi bilan ulang.",
  ].join("\n");
}

function threadFromMessage(message, env = {}) {
  return message?.message_thread_id || Number(env.TELEGRAM_TOPIC_ID || 0) || null;
}

function threadOptions(threadId = null) {
  return threadId ? { message_thread_id: Number(threadId) } : {};
}

function workoutKeyboard(env = {}, requestUrl = null, allowWebApp = false) {
  const rows = [
      [
        { text: "📋 Bugun", callback_data: "today" },
        { text: "➡️ Ertaga", callback_data: "tomorrow" },
      ],
      [
        { text: "♻️ Reset", callback_data: "reset_today" },
        { text: "ℹ️ Yordam", callback_data: "help" },
      ],
      [
        { text: "🕌 Namoz", callback_data: "namoz:today" },
        { text: "🧭 Qazo", callback_data: "qz:show" },
      ],
    ];
  const appUrl = miniAppUrl(env, requestUrl);
  if (allowWebApp && appUrl) {
    rows.unshift([{ text: "📱 Mini App", web_app: { url: appUrl } }]);
  }
  return { inline_keyboard: rows };
}

async function sendTelegram(env, chatId, text, replyMarkup = null, options = {}) {
  const body = { chat_id: chatId, text, parse_mode: "HTML", ...options };
  if (replyMarkup) body.reply_markup = replyMarkup;

  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram sendMessage failed: ${response.status} ${errorText}`);
  }
  const data = await response.json();
  return data.result;
}

async function editTelegramMessage(env, chatId, messageId, text, replyMarkup = null, options = {}) {
  const body = { chat_id: chatId, message_id: messageId, text, parse_mode: "HTML" };
  if (replyMarkup) body.reply_markup = replyMarkup;

  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorText = await response.text();
    if (errorText.includes("message is not modified")) {
      return null;
    }
    throw new Error(`Telegram editMessageText failed: ${response.status} ${errorText}`);
  }
  const data = await response.json();
  return data.result;
}

async function deleteTelegramMessage(env, chatId, messageId) {
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/deleteMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
  });
  return response.ok;
}

async function pinTelegramMessage(env, chatId, messageId) {
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/pinChatMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, disable_notification: true }),
  });
  return response.ok;
}

async function sendNativeChecklist(env, businessConnectionId, chatId, targetDate) {
  const targetChatId = Number(env.NATIVE_CHECKLIST_CHAT_ID || env.TELEGRAM_BOT_ID || 8967190826);
  const body = {
    business_connection_id: businessConnectionId,
    chat_id: targetChatId,
    checklist: buildNativeChecklist(targetDate, env),
  };

  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendChecklist`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram sendChecklist failed: ${response.status} ${errorText}`);
  }
}

function prayerTimeMinutes(value) {
  const match = String(value || "").match(/(\d{1,2}):(\d{2})/);
  if (!match) {
    return null;
  }
  return Number(match[1]) * 60 + Number(match[2]);
}

function aladhanDate(dateKey) {
  const [year, month, day] = dateKey.split("-");
  return `${day}-${month}-${year}`;
}

function monthDayFromDateKey(dateKey) {
  const [, month, day] = dateKey.split("-").map(Number);
  return { month, day };
}

function yearMonthFromDateKey(dateKey) {
  return dateKey.slice(0, 7);
}

function dateKeyFromDottedDate(value) {
  const match = String(value || "").match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) {
    return null;
  }
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function addDaysToDateKey(dateKey, offsetDays) {
  const date = parseDate(dateKey);
  date.setDate(date.getDate() + offsetDays);
  return formatDate(date);
}

function formatDuration(minutes) {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;
  if (hours <= 0) {
    return `${remainingMinutes} daqiqa`;
  }
  if (remainingMinutes === 0) {
    return `${hours} soat`;
  }
  return `${hours} soat ${remainingMinutes} daqiqa`;
}

function prayerTimesCacheKey(env, dateKey) {
  const source = prayerSource(env);
  return [
    "prayer:times",
    source,
    dateKey,
    prayerRegion(env),
    env.PRAYER_CITY || "Tashkent",
    env.PRAYER_COUNTRY || "Uzbekistan",
    env.PRAYER_METHOD || "2",
    env.PRAYER_SCHOOL || "1",
  ].join(":");
}

function parseManualPrayerTimes(env, dateKey) {
  if (!env.PRAYER_TIMES) {
    return null;
  }

  const rawTimes = {};
  for (const part of String(env.PRAYER_TIMES).split(/[,\n;]/)) {
    const [name, value] = part.split("=").map((item) => item && item.trim());
    if (["quyosh", "sunrise"].includes(String(name || "").toLowerCase()) && prayerTimeMinutes(value) !== null) {
      rawTimes.sunrise = value;
      continue;
    }
    const prayer = prayerByName(name);
    if (prayer && prayerTimeMinutes(value) !== null) {
      rawTimes[prayer.key] = value;
    }
  }

  if (!PRAYERS.every((prayer) => rawTimes[prayer.key])) {
    return null;
  }

  return {
    dateKey,
    city: env.PRAYER_CITY || "manual",
    country: env.PRAYER_COUNTRY || "manual",
    source: "manual",
    sunrise: rawTimes.sunrise
      ? { time: rawTimes.sunrise, minute: prayerTimeMinutes(rawTimes.sunrise) }
      : null,
    timings: PRAYERS.map((prayer) => ({
      ...prayer,
      time: rawTimes[prayer.key],
      minute: prayerTimeMinutes(rawTimes[prayer.key]),
    })),
  };
}

function scheduleFromIslomApi(dateKey, region, data) {
  const rawTimes = data.times || {};
  const sunriseTime = rawTimes.quyosh;
  const mappedTimes = {
    fajr: rawTimes.tong_saharlik,
    dhuhr: rawTimes.peshin,
    asr: rawTimes.asr,
    maghrib: rawTimes.shom_iftor,
    isha: rawTimes.hufton,
  };

  const timings = PRAYERS.map((prayer) => ({
    ...prayer,
    time: mappedTimes[prayer.key],
    minute: prayerTimeMinutes(mappedTimes[prayer.key]),
  })).filter((prayer) => prayer.minute !== null);

  if (timings.length !== PRAYERS.length) {
    throw new Error("IslomAPI response missing prayer times");
  }

  return {
    dateKey,
    city: region,
    country: "Uzbekistan",
    source: "islomapi",
    weekday: data.weekday,
    sunrise: sunriseTime
      ? { time: sunriseTime, minute: prayerTimeMinutes(sunriseTime) }
      : null,
    timings,
  };
}

function scheduleFromNamozVaqtiApi(dateKey, region, data) {
  const tableRow = Array.isArray(data.period_table)
    ? data.period_table.find((row) => dateKeyFromDottedDate(row.date) === dateKey)
    : null;
  const rawTimes = tableRow?.times || (data.meta?.date === dateKey ? data.today?.times : null);

  if (!rawTimes) {
    throw new Error(`Namoz-vaqti API response does not contain ${dateKey}`);
  }

  const mappedTimes = {
    fajr: rawTimes.bomdod,
    dhuhr: rawTimes.peshin,
    asr: rawTimes.asr,
    maghrib: rawTimes.shom,
    isha: rawTimes.xufton,
  };

  const timings = PRAYERS.map((prayer) => ({
    ...prayer,
    time: mappedTimes[prayer.key],
    minute: prayerTimeMinutes(mappedTimes[prayer.key]),
  })).filter((prayer) => prayer.minute !== null);

  if (timings.length !== PRAYERS.length) {
    throw new Error("Namoz-vaqti API response missing prayer times");
  }

  return {
    dateKey,
    city: data.meta?.region?.name || region,
    country: "Uzbekistan",
    source: "namozvaqti",
    sunrise: rawTimes.quyosh
      ? { time: rawTimes.quyosh, minute: prayerTimeMinutes(rawTimes.quyosh) }
      : null,
    timings,
  };
}

async function fetchNamozVaqtiPrayerSchedule(env, dateKey) {
  const region = namozVaqtiRegion(env);
  const url = new URL("https://namoz-vaqti.uz/index.php");
  url.searchParams.set("format", "json");
  url.searchParams.set("lang", env.PRAYER_LANG || "lotin");
  url.searchParams.set("period", yearMonthFromDateKey(dateKey));
  url.searchParams.set("region", region);

  const response = await fetch(url.toString(), {
    headers: { "accept": "application/json", "user-agent": "fitness-reminder-worker/1.0" },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Namoz-vaqti API failed: ${response.status} ${errorText.slice(0, 120)}`);
  }

  const data = await response.json();
  return scheduleFromNamozVaqtiApi(dateKey, region, data);
}

async function fetchIslomPrayerSchedule(env, dateKey) {
  const region = prayerRegion(env);
  const { month, day } = monthDayFromDateKey(dateKey);
  const url = new URL("https://islomapi.uz/api/daily");
  url.searchParams.set("region", region);
  url.searchParams.set("month", month);
  url.searchParams.set("day", day);

  const response = await fetch(url.toString(), {
    headers: { "user-agent": "fitness-reminder-worker/1.0" },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`IslomAPI failed: ${response.status} ${errorText.slice(0, 120)}`);
  }

  const data = await response.json();
  return scheduleFromIslomApi(dateKey, region, data);
}

async function fetchAladhanPrayerSchedule(env, dateKey) {
  const city = env.PRAYER_CITY || "Tashkent";
  const country = env.PRAYER_COUNTRY || "Uzbekistan";
  const method = env.PRAYER_METHOD || "2";
  const school = env.PRAYER_SCHOOL || "1";
  const url = new URL(`https://api.aladhan.com/v1/timingsByCity/${aladhanDate(dateKey)}`);
  url.searchParams.set("city", city);
  url.searchParams.set("country", country);
  url.searchParams.set("method", method);
  url.searchParams.set("school", school);

  const response = await fetch(url.toString());
  const data = await response.json();
  if (!response.ok || data.code !== 200) {
    throw new Error(`AlAdhan API failed: ${response.status}`);
  }

  const timings = PRAYERS.map((prayer) => {
    const time = data.data.timings[prayer.apiKey];
    return {
      ...prayer,
      time,
      minute: prayerTimeMinutes(time),
    };
  }).filter((prayer) => prayer.minute !== null);

  return {
    dateKey,
    city,
    country,
    source: "aladhan",
    timezone: data.data.meta?.timezone || "Asia/Tashkent",
    sunrise: data.data.timings.Sunrise
      ? { time: data.data.timings.Sunrise, minute: prayerTimeMinutes(data.data.timings.Sunrise) }
      : null,
    timings,
  };
}

async function fetchPrayerSchedule(env, dateKey) {
  if (prayerSource(env) === "aladhan") {
    return fetchAladhanPrayerSchedule(env, dateKey);
  }
  if (prayerSource(env) === "islomapi") {
    return fetchIslomPrayerSchedule(env, dateKey);
  }

  try {
    return await fetchNamozVaqtiPrayerSchedule(env, dateKey);
  } catch (error) {
    if (env.PRAYER_DISABLE_FALLBACK === "1") {
      throw error;
    }
    const fallback = await fetchAladhanPrayerSchedule(env, dateKey);
    return { ...fallback, source: "aladhan_fallback" };
  }
}

async function getPrayerSchedule(env, dateKey) {
  const manual = parseManualPrayerTimes(env, dateKey);
  if (manual) {
    return manual;
  }

  const cacheKey = prayerTimesCacheKey(env, dateKey);
  const cached = await kvGet(env, cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (_) {
      await kvDelete(env, cacheKey);
    }
  }

  const schedule = await fetchPrayerSchedule(env, dateKey);
  await kvPut(env, cacheKey, JSON.stringify(schedule), 60 * 60 * 36);
  return schedule;
}

function prayerDoneKey(chatId, dateKey, prayerKey) {
  return `prayer:done:${chatId}:${dateKey}:${prayerKey}`;
}

function prayerReminderKey(chatId, dateKey, prayerKey) {
  return `prayer:reminder:${chatId}:${dateKey}:${prayerKey}`;
}

function activePrayerReminderKey(chatId) {
  return `prayer:active-reminder:${chatId}`;
}

function qazoKey(chatId, prayerKey) {
  return `prayer:qazo:${chatId}:${prayerKey}`;
}

function qazoDashboardKey(chatId, threadId) {
  return `prayer:qazo-dashboard:${chatId}:${threadId || "general"}`;
}

function tasbehStateKey(chatId) {
  return `tasbeh:state:${chatId}`;
}

function normalizeTasbehState(rawState = {}) {
  const target = [33, 99].includes(Number(rawState.target)) ? Number(rawState.target) : 33;
  const zikrIndex = Math.max(0, Math.min(TASBEH_ZIKRS.length - 1, Number(rawState.zikrIndex || 0) || 0));
  const current = Math.max(0, Math.min(target - 1, Number(rawState.current || 0) || 0));
  const total = Math.max(0, Number(rawState.total || 0) || 0);
  return { target, zikrIndex, current, total };
}

async function getTasbehState(env, chatId) {
  const raw = await kvGet(env, tasbehStateKey(chatId));
  if (raw) {
    try {
      return normalizeTasbehState(JSON.parse(raw));
    } catch (_) {
      await kvDelete(env, tasbehStateKey(chatId));
    }
  }
  return normalizeTasbehState();
}

async function setTasbehState(env, chatId, state) {
  const nextState = normalizeTasbehState(state);
  await kvPut(env, tasbehStateKey(chatId), JSON.stringify(nextState), 60 * 60 * 24 * 365 * 5);
  return nextState;
}

function tasbehStateForClient(state) {
  const normalized = normalizeTasbehState(state);
  const zikr = TASBEH_ZIKRS[normalized.zikrIndex] || TASBEH_ZIKRS[0];
  return {
    ...normalized,
    zikr,
    zikrs: TASBEH_ZIKRS,
    progress: `${normalized.current} / ${normalized.target}`,
  };
}

async function isPrayerDone(env, chatId, dateKey, prayerKey) {
  return Boolean(await kvGet(env, prayerDoneKey(chatId, dateKey, prayerKey)));
}

async function prayerDoneStatus(env, chatId, dateKey, prayerKey) {
  return kvGet(env, prayerDoneKey(chatId, dateKey, prayerKey));
}

function prayerStatusMarker(doneStatus, isDue) {
  if (doneStatus === "qazo" || doneStatus === "auto_qazo") {
    return "🧾";
  }
  if (doneStatus) {
    return "✅";
  }
  return isDue ? "⏳" : "☐";
}

async function markPrayerDone(env, chatId, dateKey, prayerKey, value = "done", options = {}) {
  await kvPut(env, prayerDoneKey(chatId, dateKey, prayerKey), value, 60 * 60 * 24 * 120);
  await kvDelete(env, prayerReminderKey(chatId, dateKey, prayerKey));
  const activeRaw = await kvGet(env, activePrayerReminderKey(chatId));
  if (activeRaw) {
    try {
      const active = JSON.parse(activeRaw);
      if (active.date_key === dateKey && active.prayer_key === prayerKey) {
        if (options.deleteActiveMessage && active.message_id) {
          await deleteTelegramMessage(env, chatId, active.message_id);
        }
        await kvDelete(env, activePrayerReminderKey(chatId));
      }
    } catch (_) {
      await kvDelete(env, activePrayerReminderKey(chatId));
    }
  }
}

async function getQazoCount(env, chatId, prayerKey) {
  return Math.max(0, Number(await kvGet(env, qazoKey(chatId, prayerKey), "0")) || 0);
}

async function setQazoCount(env, chatId, prayerKey, count) {
  await kvPut(env, qazoKey(chatId, prayerKey), Math.max(0, Number(count) || 0), 60 * 60 * 24 * 365 * 5);
}

async function adjustQazoCount(env, chatId, prayerKey, delta) {
  const count = await getQazoCount(env, chatId, prayerKey);
  const nextCount = Math.max(0, count + delta);
  await setQazoCount(env, chatId, prayerKey, nextCount);
  return nextCount;
}

async function getQazoCounts(env, chatId) {
  const entries = {};
  for (const prayer of QAZO_PRAYERS) {
    entries[prayer.key] = await getQazoCount(env, chatId, prayer.key);
  }
  return entries;
}

function qazoTotal(counts) {
  return QAZO_PRAYERS.reduce((total, prayer) => total + Number(counts[prayer.key] || 0), 0);
}

async function buildQazoDashboardText(env, chatId, notice = null) {
  const counts = await getQazoCounts(env, chatId);
  return [
    "🧭 <b>Qazo panel</b>",
    "",
    `<b>Jami qazo: ${qazoTotal(counts)}</b>`,
    ...QAZO_PRAYERS.map((prayer) => `${escapeHtml(prayer.label)}: <b>${counts[prayer.key] || 0}</b>`),
    "",
    env.CHECKLIST_STATE ? "Holat KV xotirada saqlanadi." : "KV ulanmagan: qazo hisobi saqlanmaydi.",
    notice ? `\n${escapeHtml(notice)}` : "",
  ].filter(Boolean).join("\n");
}

function qazoDashboardKeyboard() {
  return {
    inline_keyboard: [
      ...QAZO_PRAYERS.map((prayer) => [
        { text: `➖ ${prayer.label}`, callback_data: `qz:-:${prayer.key}` },
        { text: `➕ ${prayer.label}`, callback_data: `qz:+:${prayer.key}` },
      ]),
      [{ text: "✏️ Qo'lda kiritish", callback_data: "qz:template" }],
      [{ text: "🔄 Yangilash", callback_data: "qz:refresh" }],
    ],
  };
}

async function upsertQazoDashboard(env, chatId, threadId, notice = null) {
  const key = qazoDashboardKey(chatId, threadId);
  const text = await buildQazoDashboardText(env, chatId, notice);
  const keyboard = qazoDashboardKeyboard();
  const existingMessageId = await kvGet(env, key);

  if (existingMessageId) {
    try {
      await editTelegramMessage(env, chatId, Number(existingMessageId), text, keyboard, threadOptions(threadId));
      return Number(existingMessageId);
    } catch (_) {
      await kvDelete(env, key);
    }
  }

  const message = await sendTelegram(env, chatId, text, keyboard, threadOptions(threadId));
  if (message?.message_id) {
    await kvPut(env, key, message.message_id, 60 * 60 * 24 * 365 * 5);
    await pinTelegramMessage(env, chatId, message.message_id);
    return message.message_id;
  }
  return null;
}

function prayerReminderKeyboard(dateKey, prayerKey) {
  return {
    inline_keyboard: [
      [
        { text: "✅ O'qidim", callback_data: `prd:${dateKey}:${prayerKey}` },
        { text: "➕ Qazo bo'ldi", callback_data: `prq:${dateKey}:${prayerKey}` },
      ],
      [{ text: "🧭 Qazo panel", callback_data: "qz:show" }],
    ],
  };
}

async function buildPrayerReminderText(env, chatId, schedule, prayer, nowParts) {
  const counts = await getQazoCounts(env, chatId);
  const fajrDeadlineLine = prayer.key === "fajr" && schedule.sunrise?.minute !== null && schedule.sunrise?.minute !== undefined
    ? `Quyosh chiqishigacha qoldi: <b>${escapeHtml(formatDuration(schedule.sunrise.minute - nowParts.minutes))}</b>`
    : null;
  const sunriseLine = prayer.key === "fajr" && schedule.sunrise?.time
    ? `Quyosh: <b>${escapeHtml(schedule.sunrise.time)}</b>`
    : null;
  const headerLines = [
    `🕌 <b>${escapeHtml(prayer.label)} vaqti kirdi</b>`,
    `<code>${escapeHtml(schedule.dateKey)}</code> • <b>${escapeHtml(prayer.time)}</b>`,
  ];
  if (fajrDeadlineLine) {
    headerLines.push(fajrDeadlineLine);
  }
  if (sunriseLine) {
    headerLines.push(sunriseLine);
  }

  return [
    ...headerLines,
    "",
    "O'qiguningizcha eslatma qayta keladi.",
    "Yangi eslatma yuborilganda oldingi eslatma o'chiriladi.",
    "",
    `Hozir: <code>${String(nowParts.hour).padStart(2, "0")}:${String(nowParts.minute).padStart(2, "0")}</code>`,
    `Jami qazo: <b>${qazoTotal(counts)}</b>`,
  ].join("\n");
}

function buildPrayerDoneText(schedule, prayer, status, qazoKeys = null) {
  const isQazo = status === "qazo";
  const qazoLabel = qazoKeys
    ? qazoKeys.map(qazoPrayerLabel).join(" + ")
    : prayer.label;
  return [
    `${isQazo ? "🧾" : "✅"} <b>${escapeHtml(prayer.label)}</b>`,
    `<code>${escapeHtml(schedule.dateKey)}</code> • <b>${escapeHtml(prayer.time)}</b>`,
    "",
    isQazo ? `${escapeHtml(qazoLabel)} qazo hisobiga qo'shildi.` : "O'qildi deb belgilandi.",
  ].join("\n");
}

function prayerFromSchedule(schedule, prayerKey) {
  return schedule.timings.find((prayer) => prayer.key === prayerKey) || null;
}

function qazoPrayerLabel(prayerKey) {
  return QAZO_PRAYERS.find((prayer) => prayer.key === prayerKey)?.label || prayerKey;
}

function missedQazoKeys(prayerKey, includeWitr = false) {
  if (prayerKey === "isha" && includeWitr) {
    return ["isha", "witr"];
  }
  return [prayerKey];
}

function prayerDeadlineMinute(schedule, prayerKey) {
  if (prayerKey === "fajr") {
    return schedule.sunrise?.minute ?? prayerFromSchedule(schedule, "dhuhr")?.minute ?? null;
  }
  if (prayerKey === "dhuhr") {
    return prayerFromSchedule(schedule, "asr")?.minute ?? null;
  }
  if (prayerKey === "asr") {
    return prayerFromSchedule(schedule, "maghrib")?.minute ?? null;
  }
  if (prayerKey === "maghrib") {
    return prayerFromSchedule(schedule, "isha")?.minute ?? null;
  }
  return null;
}

function isPrayerReminderWindowOpen(schedule, prayer, nowMinutes) {
  if (nowMinutes < prayer.minute) {
    return false;
  }
  const deadline = prayerDeadlineMinute(schedule, prayer.key);
  return deadline === null || nowMinutes < deadline;
}

async function autoQazoPrayer(env, chatId, schedule, prayerKey, options = {}) {
  const prayer = prayerFromSchedule(schedule, prayerKey);
  if (!prayer || await isPrayerDone(env, chatId, schedule.dateKey, prayerKey)) {
    return null;
  }

  const qazoKeys = missedQazoKeys(prayerKey, options.includeWitr);
  for (const key of qazoKeys) {
    await adjustQazoCount(env, chatId, key, 1);
  }
  await markPrayerDone(env, chatId, schedule.dateKey, prayerKey, "auto_qazo", {
    deleteActiveMessage: true,
  });

  const labels = qazoKeys.map(qazoPrayerLabel).join(" + ");
  return `${labels} qazo hisobiga avtomatik qo'shildi.`;
}

async function autoCloseMissedPrayers(env, chatId, schedule, nowParts, threadId) {
  const notices = [];
  const fajr = prayerFromSchedule(schedule, "fajr");

  if (fajr && nowParts.minutes >= fajr.minute) {
    const previousDateKey = addDaysToDateKey(schedule.dateKey, -1);
    const previousSchedule = await getPrayerSchedule(env, previousDateKey);
    const notice = await autoQazoPrayer(env, chatId, previousSchedule, "isha", {
      includeWitr: true,
    });
    if (notice) {
      notices.push(`${previousDateKey}: ${notice}`);
    }
  }

  for (const prayer of schedule.timings) {
    const deadline = prayerDeadlineMinute(schedule, prayer.key);
    if (deadline !== null && nowParts.minutes >= deadline) {
      const notice = await autoQazoPrayer(env, chatId, schedule, prayer.key);
      if (notice) {
        notices.push(`${schedule.dateKey}: ${notice}`);
      }
    }
  }

  if (notices.length > 0) {
    await upsertQazoDashboard(env, chatId, threadId, notices.join(" "));
  }
}

async function sendPrayerReminder(env, chatId, threadId, schedule, prayer, nowParts) {
  const stateKey = prayerReminderKey(chatId, schedule.dateKey, prayer.key);
  const activeKey = activePrayerReminderKey(chatId);
  const intervalMs = prayerReminderIntervalMinutes(env) * 60 * 1000;
  const previousRaw = await kvGet(env, stateKey);

  if (previousRaw) {
    try {
      const previous = JSON.parse(previousRaw);
      const sentAt = new Date(previous.sent_at).getTime();
      if (Number.isFinite(sentAt) && Date.now() - sentAt < intervalMs) {
        return;
      }
      if (previous.message_id) {
        await deleteTelegramMessage(env, chatId, previous.message_id);
      }
    } catch (_) {
      await kvDelete(env, stateKey);
    }
  }

  const activeRaw = await kvGet(env, activeKey);
  if (activeRaw) {
    try {
      const active = JSON.parse(activeRaw);
      if (active.message_id) {
        await deleteTelegramMessage(env, chatId, active.message_id);
      }
      if (active.date_key && active.prayer_key) {
        await kvDelete(env, prayerReminderKey(chatId, active.date_key, active.prayer_key));
      }
    } catch (_) {
      await kvDelete(env, activeKey);
    }
  }

  const message = await sendTelegram(
    env,
    chatId,
    await buildPrayerReminderText(env, chatId, schedule, prayer, nowParts),
    prayerReminderKeyboard(schedule.dateKey, prayer.key),
    threadOptions(threadId)
  );
  if (message?.message_id) {
    await kvPut(
      env,
      stateKey,
      JSON.stringify({ message_id: message.message_id, sent_at: new Date().toISOString() }),
      60 * 60 * 24 * 3
    );
    await kvPut(
      env,
      activeKey,
      JSON.stringify({
        message_id: message.message_id,
        sent_at: new Date().toISOString(),
        date_key: schedule.dateKey,
        prayer_key: prayer.key,
      }),
      60 * 60 * 24 * 3
    );
  }
}

async function pendingPrayer(env, chatId, schedule, nowMinutes) {
  const fajr = prayerFromSchedule(schedule, "fajr");
  if (fajr && nowMinutes < fajr.minute) {
    const previousSchedule = await getPrayerSchedule(env, addDaysToDateKey(schedule.dateKey, -1));
    const previousIsha = prayerFromSchedule(previousSchedule, "isha");
    if (previousIsha && !(await isPrayerDone(env, chatId, previousSchedule.dateKey, "isha"))) {
      return { schedule: previousSchedule, prayer: previousIsha };
    }
    return null;
  }

  const duePrayers = schedule.timings.filter((prayer) => isPrayerReminderWindowOpen(schedule, prayer, nowMinutes));
  for (const prayer of duePrayers.reverse()) {
    if (!(await isPrayerDone(env, chatId, schedule.dateKey, prayer.key))) {
      return { schedule, prayer };
    }
  }
  return null;
}

async function runPrayerReminder(env) {
  const chatId = prayerChatId(env);
  if (!chatId || !env.TELEGRAM_BOT_TOKEN) {
    return;
  }

  const nowParts = tashkentNowParts();
  const schedule = await getPrayerSchedule(env, nowParts.dateKey);
  const threadId = prayerThreadId(env);

  await autoCloseMissedPrayers(env, chatId, schedule, nowParts, threadId);

  const pending = await pendingPrayer(env, chatId, schedule, nowParts.minutes);
  if (!pending) {
    return;
  }

  await sendPrayerReminder(env, chatId, threadId, pending.schedule, pending.prayer, nowParts);
}

async function buildPrayerStatusText(env, chatId) {
  const nowParts = tashkentNowParts();
  const schedule = await getPrayerSchedule(env, nowParts.dateKey);
  const counts = await getQazoCounts(env, chatId);
  const lines = [];

  for (const prayer of schedule.timings) {
    const doneStatus = await prayerDoneStatus(env, chatId, schedule.dateKey, prayer.key);
    const marker = prayerStatusMarker(doneStatus, nowParts.minutes >= prayer.minute);
    lines.push(`${marker} ${escapeHtml(prayer.label)}: <b>${escapeHtml(prayer.time)}</b>`);
    if (prayer.key === "fajr" && schedule.sunrise?.time) {
      lines.push(`☀️ Quyosh: <b>${escapeHtml(schedule.sunrise.time)}</b>`);
    }
  }

  const next = schedule.timings.find((prayer) => prayer.minute > nowParts.minutes);
  return [
    "🕌 <b>Namoz vaqtlari</b>",
    `<code>${escapeHtml(schedule.dateKey)}</code> • ${escapeHtml(schedule.city)}, ${escapeHtml(schedule.country)}`,
    `Manba: <code>${escapeHtml(schedule.source || "unknown")}</code>`,
    "",
    ...lines,
    "",
    next ? `Keyingi namoz: <b>${escapeHtml(next.label)}</b> ${escapeHtml(next.time)}` : "Bugungi barcha namoz vaqtlari kirgan.",
    `Jami qazo: <b>${qazoTotal(counts)}</b>`,
  ].join("\n");
}

function prayerStatusKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "🧭 Qazo panel", callback_data: "qz:show" }],
      [{ text: "🔄 Yangilash", callback_data: "namoz:today" }],
    ],
  };
}

function wantsNamoz(text) {
  const normalized = normalizeCommand(text);
  return normalized === "/namoz" || normalized.includes("namoz");
}

function wantsQazo(text) {
  const normalized = normalizeCommand(text);
  return normalized === "/qazo" || normalized === "/qazolar";
}

function parseQazoAssignments(text) {
  const assignments = {};
  const parts = String(text || "")
    .replace(/,/g, " ")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  for (const part of parts) {
    const match = part.match(/^([^=\s:]+)\s*[=:]\s*(\d+)$/);
    if (!match) {
      continue;
    }
    const prayer = prayerByName(match[1]);
    if (prayer) {
      assignments[prayer.key] = Number(match[2]);
    }
  }

  return assignments;
}

function parseQazoBulkCommand(text) {
  const normalized = normalizeCommand(text);
  const command = normalized.split(/\s+/)[0];
  if (!["/qazo_bulk", "/qazo_edit", "/qazolar_set"].includes(command)) {
    return null;
  }

  const assignments = parseQazoAssignments(normalized.replace(command, ""));
  if (Object.keys(assignments).length === 0) {
    return { error: true };
  }

  return { assignments };
}

function parseQazoCommand(text) {
  const parts = normalizeCommand(text).split(/\s+/).filter(Boolean);
  const command = parts[0];
  if (!["/qazo_set", "/qazo_add", "/qazo_minus"].includes(command)) {
    return null;
  }

  const prayer = prayerByName(parts[1]);
  const amount = Number(parts[2]);
  if (!prayer || !Number.isFinite(amount)) {
    return { error: true };
  }

  return {
    prayer,
    amount: Math.max(0, Math.floor(amount)),
    type: command.replace("/qazo_", ""),
  };
}

function qazoUsageMessage() {
  return [
    "Qazo hisobini kiritish:",
    "",
    "<code>/qazo_set bomdod 10</code>",
    "<code>/qazo_add peshin 1</code>",
    "<code>/qazo_minus asr 1</code>",
    "",
    "Hammasini bitta xabarda kiritish:",
    "",
    "<code>/qazo_bulk bomdod=0 peshin=0 asr=0 shom=0 xufton=0 vitr=0</code>",
    "",
    "Nomlar: bomdod, peshin, asr, shom, xufton, vitr.",
  ].join("\n");
}

function qazoBulkTemplateMessage() {
  return [
    "✏️ <b>Qazo sonlarini qo'lda kiritish</b>",
    "",
    "Quyidagi namunani yuboring va raqamlarni o'zingiznikiga almashtiring:",
    "",
    "<code>/qazo_bulk bomdod=0 peshin=0 asr=0 shom=0 xufton=0 vitr=0</code>",
    "",
    "Masalan:",
    "<code>/qazo_bulk bomdod=120 peshin=80 asr=75 shom=70 xufton=60 vitr=60</code>",
  ].join("\n");
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch (_) {
    return {};
  }
}

function bytesToHex(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256(keyBytes, text) {
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
  return new Uint8Array(signature);
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) {
    return false;
  }
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

async function verifyTelegramWebAppInitData(initData, env) {
  if (env.MINI_APP_AUTH_DISABLED === "1") {
    return { ok: true, user: { id: "dev" }, dev: true };
  }
  if (!initData || !env.TELEGRAM_BOT_TOKEN) {
    return { ok: false, error: "Mini App Telegram ichidan ochilishi kerak." };
  }

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) {
    return { ok: false, error: "Telegram initData hash topilmadi." };
  }
  params.delete("hash");

  const authDate = Number(params.get("auth_date") || 0);
  const maxAge = Number(env.MINI_APP_AUTH_MAX_AGE_SECONDS || 60 * 60 * 24 * 7);
  if (authDate && Date.now() / 1000 - authDate > maxAge) {
    return { ok: false, error: "Telegram initData muddati o'tgan." };
  }

  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secret = await hmacSha256(new TextEncoder().encode("WebAppData"), env.TELEGRAM_BOT_TOKEN);
  const calculatedHash = bytesToHex(await hmacSha256(secret, dataCheckString));

  if (!constantTimeEqual(calculatedHash, hash)) {
    return { ok: false, error: "Telegram initData noto'g'ri." };
  }

  let user = null;
  try {
    user = JSON.parse(params.get("user") || "null");
  } catch (_) {
    user = null;
  }
  return { ok: true, user };
}

function isAllowedMiniAppUser(auth, env) {
  if (auth.dev) {
    return true;
  }

  const userId = auth.user?.id;
  if (!userId) {
    return false;
  }

  const allowed = [
    env.MINI_APP_ALLOWED_USER_IDS,
    env.TELEGRAM_CHAT_ID,
    env.NATIVE_CHECKLIST_CHAT_ID,
    env.TELEGRAM_ALLOWED_CHAT_IDS,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter((value) => value && !value.startsWith("-"));

  return allowed.length === 0 || allowed.includes(String(userId));
}

function miniAppChatId(env) {
  return env.MINI_APP_CHAT_ID || prayerChatId(env) || env.TELEGRAM_CHAT_ID;
}

function miniAppFitnessChatId(env) {
  return env.MINI_APP_FITNESS_CHAT_ID || miniAppChatId(env);
}

function miniAppUrl(env, requestUrl = null) {
  if (env.MINI_APP_URL) {
    return env.MINI_APP_URL;
  }
  if (requestUrl) {
    return new URL("/app", requestUrl).toString();
  }
  return null;
}

async function buildMiniAppState(env, options = {}) {
  const nowParts = tashkentNowParts();
  const targetDate = dateFromMiniApp(options.fitnessDate || nowParts.dateKey);
  const chatId = miniAppChatId(env);
  const fitnessChatId = miniAppFitnessChatId(env);
  const plan = workoutPlanFor(targetDate, env);
  const tasks = checklistTasks(targetDate, env);
  const mask = await getChecklistMask(env, fitnessChatId, targetDate);
  const schedule = await getPrayerSchedule(env, nowParts.dateKey);
  const counts = await getQazoCounts(env, chatId);
  const tasbehState = await getTasbehState(env, chatId);
  const prayerRows = [];

  for (const prayer of schedule.timings) {
    const doneStatus = await prayerDoneStatus(env, chatId, schedule.dateKey, prayer.key);
    prayerRows.push({
      key: prayer.key,
      label: prayer.label,
      time: prayer.time,
      doneStatus,
      marker: prayerStatusMarker(doneStatus, nowParts.minutes >= prayer.minute),
      isDue: nowParts.minutes >= prayer.minute,
      isOpen: isPrayerReminderWindowOpen(schedule, prayer, nowParts.minutes),
    });
  }

  return {
    now: {
      date: nowParts.dateKey,
      time: `${String(nowParts.hour).padStart(2, "0")}:${String(nowParts.minute).padStart(2, "0")}`,
    },
    chat: {
      id: chatId,
      fitnessChatId,
      threadId: prayerThreadId(env),
    },
    fitness: {
      date: formatDate(targetDate),
      title: plan?.title || "8 haftalik reja",
      workout: plan?.workout || "Progressni ko'rib chiqish",
      treadmill: plan?.treadmill || "",
      stair: plan?.stair || "",
      completed: tasks.filter((_, index) => Boolean(mask & (1 << index))).length,
      total: tasks.length,
      tasks: tasks.map((task, index) => ({
        index,
        text: task,
        done: Boolean(mask & (1 << index)),
      })),
    },
    prayer: {
      date: schedule.dateKey,
      city: schedule.city,
      source: schedule.source,
      sunrise: schedule.sunrise,
      rows: prayerRows,
    },
    qazo: {
      total: qazoTotal(counts),
      counts: QAZO_PRAYERS.map((prayer) => ({
        key: prayer.key,
        label: prayer.label,
        count: counts[prayer.key] || 0,
      })),
    },
    tasbeh: tasbehStateForClient(tasbehState),
  };
}

async function handleMiniAppApi(request, env) {
  const auth = await verifyTelegramWebAppInitData(request.headers.get("x-telegram-init-data"), env);
  if (!auth.ok) {
    return jsonResponse({ ok: false, error: auth.error }, 401);
  }
  if (!isAllowedMiniAppUser(auth, env)) {
    return jsonResponse({ ok: false, error: "Bu Mini App shaxsiy foydalanish uchun sozlangan." }, 403);
  }

  const url = new URL(request.url);
  const chatId = miniAppChatId(env);
  const fitnessChatId = miniAppFitnessChatId(env);
  const threadId = prayerThreadId(env);
  let requestedFitnessDate = url.searchParams.get("fitness_date");
  if (!chatId || !fitnessChatId) {
    return jsonResponse({ ok: false, error: "MINI_APP_CHAT_ID yoki TELEGRAM_CHAT_ID sozlanmagan." }, 500);
  }

  if (request.method === "GET" && url.pathname === "/api/app-state") {
    return jsonResponse({ ok: true, state: await buildMiniAppState(env, { fitnessDate: requestedFitnessDate }) });
  }
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }

  const body = await readJsonBody(request);
  requestedFitnessDate = body.fitness_date || body.date || requestedFitnessDate;

  if (url.pathname === "/api/checklist-toggle") {
    const targetDate = dateFromMiniApp(body.date || body.fitness_date || requestedFitnessDate || tashkentNowParts().dateKey);
    const tasks = checklistTasks(targetDate, env);
    const allMask = (1 << tasks.length) - 1;
    const currentMask = await getChecklistMask(env, fitnessChatId, targetDate);
    let nextMask = currentMask;

    if (body.action === "reset") {
      nextMask = 0;
    } else if (body.action === "all") {
      nextMask = allMask;
    } else {
      const index = Number(body.index);
      if (!Number.isInteger(index) || index < 0 || index >= tasks.length) {
        return jsonResponse({ ok: false, error: "Checklist bandi noto'g'ri." }, 400);
      }
      nextMask = typeof body.done === "boolean"
        ? body.done ? currentMask | (1 << index) : currentMask & ~(1 << index)
        : currentMask ^ (1 << index);
    }

    await setChecklistMask(env, fitnessChatId, targetDate, nextMask);
    return jsonResponse({ ok: true, state: await buildMiniAppState(env, { fitnessDate: targetDate }) });
  }

  if (url.pathname === "/api/qazo-adjust") {
    const prayer = prayerByName(body.key);
    const delta = Number(body.delta);
    if (!prayer || !Number.isFinite(delta)) {
      return jsonResponse({ ok: false, error: "Qazo bandi noto'g'ri." }, 400);
    }
    await adjustQazoCount(env, chatId, prayer.key, Math.trunc(delta));
    await upsertQazoDashboard(env, chatId, threadId, "Mini App orqali yangilandi.");
    return jsonResponse({ ok: true, state: await buildMiniAppState(env, { fitnessDate: requestedFitnessDate }) });
  }

  if (url.pathname === "/api/qazo-bulk") {
    const rawCounts = body.counts || {};
    for (const [key, value] of Object.entries(rawCounts)) {
      const prayer = prayerByName(key);
      const count = Number(value);
      if (prayer && Number.isFinite(count)) {
        await setQazoCount(env, chatId, prayer.key, Math.max(0, Math.floor(count)));
      }
    }
    await upsertQazoDashboard(env, chatId, threadId, "Mini App orqali qazo sonlari kiritildi.");
    return jsonResponse({ ok: true, state: await buildMiniAppState(env, { fitnessDate: requestedFitnessDate }) });
  }

  if (url.pathname === "/api/prayer-done") {
    const dateKey = /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : tashkentNowParts().dateKey;
    const schedule = await getPrayerSchedule(env, dateKey);
    const prayer = prayerFromSchedule(schedule, body.key);
    if (!prayer) {
      return jsonResponse({ ok: false, error: "Namoz topilmadi." }, 400);
    }
    const previousStatus = await prayerDoneStatus(env, chatId, dateKey, prayer.key);
    if (body.status === "qazo") {
      const qazoKeys = missedQazoKeys(prayer.key, prayer.key === "isha");
      if (previousStatus !== "qazo" && previousStatus !== "auto_qazo") {
        for (const key of qazoKeys) {
          await adjustQazoCount(env, chatId, key, 1);
        }
      }
      await markPrayerDone(env, chatId, dateKey, prayer.key, "qazo");
    } else {
      await markPrayerDone(env, chatId, dateKey, prayer.key, "done");
    }
    await upsertQazoDashboard(env, chatId, threadId, "Mini App orqali namoz holati yangilandi.");
    return jsonResponse({ ok: true, state: await buildMiniAppState(env, { fitnessDate: requestedFitnessDate }) });
  }

  if (url.pathname === "/api/tasbeh") {
    const action = String(body.action || "increment");
    let tasbehState = await getTasbehState(env, chatId);

    if (action === "set_target") {
      const target = Number(body.target);
      if (![33, 99].includes(target)) {
        return jsonResponse({ ok: false, error: "Tasbeh sanoq turi noto'g'ri." }, 400);
      }
      tasbehState = await setTasbehState(env, chatId, {
        ...tasbehState,
        target,
        current: Math.min(tasbehState.current, target - 1),
      });
    } else if (action === "reset_current") {
      tasbehState = await setTasbehState(env, chatId, { ...tasbehState, current: 0 });
    } else if (action === "next") {
      tasbehState = await setTasbehState(env, chatId, {
        ...tasbehState,
        current: 0,
        zikrIndex: (tasbehState.zikrIndex + 1) % TASBEH_ZIKRS.length,
      });
    } else if (action === "increment") {
      const nextTotal = tasbehState.total + 1;
      const nextCurrent = tasbehState.current + 1;
      tasbehState = nextCurrent >= tasbehState.target
        ? await setTasbehState(env, chatId, {
          ...tasbehState,
          total: nextTotal,
          current: 0,
          zikrIndex: (tasbehState.zikrIndex + 1) % TASBEH_ZIKRS.length,
        })
        : await setTasbehState(env, chatId, {
          ...tasbehState,
          total: nextTotal,
          current: nextCurrent,
        });
    } else {
      return jsonResponse({ ok: false, error: "Tasbeh action tushunarsiz." }, 400);
    }

    return jsonResponse({ ok: true, state: await buildMiniAppState(env, { fitnessDate: requestedFitnessDate }) });
  }

  return jsonResponse({ ok: false, error: "Endpoint topilmadi." }, 404);
}

function miniAppHtml() {
  return new Response(`<!doctype html>
<html lang="uz">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>8 haftalik marafon</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    :root {
      color-scheme: light dark;
      --bg: var(--tg-theme-bg-color, #f4f6f8);
      --surface: var(--tg-theme-secondary-bg-color, #ffffff);
      --surface-strong: rgba(44, 80, 132, 0.12);
      --text: var(--tg-theme-text-color, #16202a);
      --muted: var(--tg-theme-hint-color, #6b7280);
      --line: rgba(127, 127, 127, 0.22);
      --button: var(--tg-theme-button-color, #2f6fed);
      --button-text: var(--tg-theme-button-text-color, #ffffff);
      --ok: #16803c;
      --danger: #b3261e;
      --radius: 8px;
      --motion-spring: cubic-bezier(0.2, 0.8, 0.2, 1);
      --motion-soft: cubic-bezier(0.16, 1, 0.3, 1);
      --bg-fitness-image: url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=70");
      --bg-prayer-image: url("https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=70");
      --bg-qazo-image: url("https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1200&q=70");
      --bg-tasbeh-image: url("https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=70");
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-size: 16px;
      letter-spacing: 0;
      -webkit-tap-highlight-color: transparent;
    }
    .shell {
      width: min(760px, 100%);
      margin: 0 auto;
      padding: calc(14px + env(safe-area-inset-top)) 14px calc(22px + env(safe-area-inset-bottom));
    }
    .topbar {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: center;
      padding: 4px 0 12px;
    }
    h1 {
      margin: 0;
      font-size: 22px;
      line-height: 1.15;
    }
    .meta {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.4;
      margin-top: 4px;
    }
    .tabs {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 4px;
      position: sticky;
      top: 0;
      z-index: 2;
    }
    button {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      min-height: 44px;
      padding: 10px 12px;
      font: inherit;
      font-weight: 650;
      cursor: pointer;
      transition:
        transform 180ms var(--motion-spring),
        background-color 220ms var(--motion-soft),
        border-color 220ms var(--motion-soft),
        opacity 220ms var(--motion-soft);
      touch-action: manipulation;
    }
    button:active {
      transform: scale(0.975);
    }
    button.primary {
      background: var(--button);
      border-color: var(--button);
      color: var(--button-text);
    }
    button.subtle {
      background: transparent;
    }
    button.danger {
      color: var(--danger);
    }
    button:disabled {
      opacity: 0.55;
      cursor: default;
    }
    .tabs button {
      border: 0;
      min-height: 38px;
    }
    .tabs button.active {
      background: var(--button);
      color: var(--button-text);
    }
    #app {
      transform-origin: 50% 24px;
      will-change: opacity, transform;
    }
    .panel {
      margin-top: 12px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    }
    .panel.with-bg {
      position: relative;
      isolation: isolate;
      color: #fff;
      background: #101820;
    }
    .panel.with-bg::before,
    .panel.with-bg::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .panel.with-bg::before {
      z-index: -2;
      background-image: var(--panel-image);
      background-size: cover;
      background-position: center;
      filter: blur(10px) saturate(1.08);
      transform: scale(1.08);
      opacity: 0.9;
    }
    .panel.with-bg::after {
      z-index: -1;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0.64)),
        rgba(0, 0, 0, 0.52);
    }
    .theme-fitness {
      --panel-image: var(--bg-fitness-image);
    }
    .theme-prayer {
      --panel-image: var(--bg-prayer-image);
    }
    .theme-qazo {
      --panel-image: var(--bg-qazo-image);
    }
    .theme-tasbeh {
      --panel-image: var(--bg-tasbeh-image);
    }
    .panel.with-bg .panel-head,
    .panel.with-bg .row,
    .panel.with-bg .qazo-row {
      border-color: rgba(255, 255, 255, 0.18);
    }
    .panel.with-bg .summary,
    .panel.with-bg .date-pill span,
    .panel.with-bg .time,
    .panel.with-bg small {
      color: rgba(255, 255, 255, 0.76);
    }
    .panel.with-bg button:not(.primary) {
      color: #fff;
      background: rgba(255, 255, 255, 0.13);
      border-color: rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(12px);
    }
    .panel.with-bg .row,
    .panel.with-bg .qazo-row {
      background: rgba(255, 255, 255, 0.02);
    }
    .panel.with-bg input {
      color: #fff;
      background: rgba(0, 0, 0, 0.26);
      border-color: rgba(255, 255, 255, 0.18);
    }
    .panel-head {
      padding: 14px;
      border-bottom: 1px solid var(--line);
      display: grid;
      gap: 6px;
    }
    h2 {
      margin: 0;
      font-size: 18px;
      line-height: 1.2;
    }
    .day-nav {
      display: grid;
      grid-template-columns: 44px 1fr 44px;
      gap: 8px;
      align-items: center;
    }
    .day-nav button {
      min-height: 42px;
      padding: 0;
      font-size: 24px;
      line-height: 1;
      background: var(--surface-strong);
    }
    .date-pill {
      display: grid;
      gap: 3px;
      min-width: 0;
      text-align: center;
    }
    .date-pill strong,
    .date-pill span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .date-pill span {
      color: var(--muted);
      font-size: 13px;
      font-weight: 550;
    }
    .summary {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6px;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.35;
    }
    .progress {
      height: 8px;
      background: var(--surface-strong);
      border-radius: 999px;
      overflow: hidden;
    }
    .progress span {
      display: block;
      height: 100%;
      width: 0%;
      background: var(--ok);
      transition: width 520ms var(--motion-soft);
    }
    .list {
      display: grid;
    }
    .row {
      display: grid;
      grid-template-columns: 28px 1fr auto;
      gap: 10px;
      align-items: center;
      width: 100%;
      border: 0;
      border-bottom: 1px solid var(--line);
      border-radius: 0;
      background: transparent;
      text-align: left;
      min-height: 52px;
      padding: 10px 14px;
      font-weight: 550;
      transition:
        transform 180ms var(--motion-spring),
        background-color 220ms var(--motion-soft),
        opacity 220ms var(--motion-soft);
    }
    .row:active {
      transform: scale(0.992);
      background: var(--surface-strong);
    }
    .row:last-child {
      border-bottom: 0;
    }
    .check {
      width: 22px;
      height: 22px;
      border: 2px solid var(--line);
      border-radius: 50%;
      display: grid;
      place-items: center;
      color: var(--button-text);
      font-size: 14px;
      line-height: 1;
      transition:
        transform 220ms var(--motion-spring),
        background-color 220ms var(--motion-soft),
        border-color 220ms var(--motion-soft);
    }
    .row.done .check {
      background: var(--ok);
      border-color: var(--ok);
      animation: check-pop 280ms var(--motion-spring);
    }
    .row.done .label {
      text-decoration: line-through;
      color: var(--muted);
    }
    .actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      padding: 12px 14px 14px;
    }
    .prayer-row {
      grid-template-columns: 1fr auto;
    }
    .prayer-row .time {
      color: var(--muted);
      font-size: 14px;
      white-space: nowrap;
    }
    .prayer-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px;
      grid-column: 1 / -1;
    }
    .qazo-row {
      display: grid;
      grid-template-columns: 1fr 42px 82px 42px;
      gap: 8px;
      align-items: center;
      padding: 10px 14px;
      border-bottom: 1px solid var(--line);
    }
    .qazo-row:last-child {
      border-bottom: 0;
    }
    .qazo-row input {
      width: 100%;
      min-height: 42px;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--bg);
      color: var(--text);
      padding: 8px;
      text-align: center;
      font: inherit;
      font-weight: 650;
    }
    .tasbeh-head {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: start;
    }
    .tasbeh-total {
      min-width: 92px;
      padding: 8px 10px;
      border-radius: var(--radius);
      background: rgba(255, 255, 255, 0.13);
      border: 1px solid rgba(255, 255, 255, 0.16);
      text-align: center;
      backdrop-filter: blur(12px);
    }
    .tasbeh-total strong {
      display: block;
      font-size: 20px;
      line-height: 1.1;
    }
    .tasbeh-total span {
      color: rgba(255, 255, 255, 0.74);
      font-size: 12px;
      font-weight: 650;
    }
    .segmented {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px;
      padding: 12px 14px 0;
    }
    .segmented button.active {
      background: var(--button);
      border-color: var(--button);
      color: var(--button-text);
    }
    .tasbeh-counter {
      display: grid;
      place-items: center;
      padding: 18px 14px;
    }
    .tasbeh-button {
      width: min(230px, 72vw);
      aspect-ratio: 1;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, 0.16);
      border: 1px solid rgba(255, 255, 255, 0.22);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        0 18px 50px rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(14px);
      color: #fff;
    }
    .tasbeh-button:active {
      transform: scale(0.965);
    }
    .tasbeh-count {
      display: grid;
      gap: 6px;
      text-align: center;
    }
    .tasbeh-count strong {
      font-size: clamp(44px, 16vw, 72px);
      line-height: 0.95;
    }
    .tasbeh-count span {
      color: rgba(255, 255, 255, 0.76);
      font-size: 14px;
    }
    .status {
      min-height: 22px;
      margin-top: 10px;
      color: var(--muted);
      font-size: 13px;
    }
    .error {
      color: var(--danger);
    }
    .hidden {
      display: none;
    }
    #app.motion-next > .panel {
      animation: slide-from-right 420ms var(--motion-soft) both;
    }
    #app.motion-prev > .panel {
      animation: slide-from-left 420ms var(--motion-soft) both;
    }
    #app.motion-tab > .panel {
      animation: fade-rise 320ms var(--motion-soft) both;
    }
    #app.motion-update > .panel {
      animation: soft-settle 260ms var(--motion-spring) both;
    }
    #app.motion-fade > .panel {
      animation: fade-rise 360ms var(--motion-soft) both;
    }
    #app.motion-next .row,
    #app.motion-prev .row,
    #app.motion-tab .row {
      animation: row-enter 440ms var(--motion-soft) both;
    }
    @keyframes slide-from-right {
      from {
        opacity: 0;
        transform: translate3d(34px, 0, 0) scale(0.985);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
    }
    @keyframes slide-from-left {
      from {
        opacity: 0;
        transform: translate3d(-34px, 0, 0) scale(0.985);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
    }
    @keyframes fade-rise {
      from {
        opacity: 0;
        transform: translate3d(0, 10px, 0) scale(0.99);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
    }
    @keyframes soft-settle {
      from {
        opacity: 0.9;
        transform: scale(0.992);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes row-enter {
      from {
        opacity: 0;
        transform: translate3d(0, 8px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    @keyframes check-pop {
      0% {
        transform: scale(0.72);
      }
      70% {
        transform: scale(1.12);
      }
      100% {
        transform: scale(1);
      }
    }
    @media (max-width: 420px) {
      .shell {
        padding-left: 10px;
        padding-right: 10px;
      }
      .qazo-row {
        grid-template-columns: 1fr 38px 72px 38px;
        gap: 6px;
      }
      button {
        padding-left: 8px;
        padding-right: 8px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 1ms !important;
      }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div>
        <h1>8 haftalik marafon</h1>
        <div class="meta" id="meta">Yuklanmoqda...</div>
      </div>
      <button class="subtle" data-action="refresh">Yangilash</button>
    </header>

    <nav class="tabs" aria-label="Bo'limlar">
      <button class="active" data-tab="fitness">Fitness</button>
      <button data-tab="prayer">Namoz</button>
      <button data-tab="qazo">Qazo</button>
      <button data-tab="tasbeh">Tasbeh</button>
    </nav>

    <main id="app"></main>
    <div id="status" class="status"></div>
  </div>

  <script>
    (function () {
      var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
      if (tg) {
        tg.ready();
        tg.expand();
      }

      var state = null;
      var activeTab = "fitness";
      var selectedFitnessDate = null;
      var busy = false;
      var pendingMotion = "fade";
      var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var touchStartX = 0;
      var touchStartY = 0;
      var app = document.getElementById("app");
      var statusEl = document.getElementById("status");
      var metaEl = document.getElementById("meta");

      function escapeText(value) {
        return String(value == null ? "" : value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      }

      function setStatus(text, isError) {
        statusEl.textContent = text || "";
        statusEl.className = isError ? "status error" : "status";
      }

      function runMotion(type) {
        app.classList.remove("motion-next", "motion-prev", "motion-tab", "motion-update", "motion-fade");
        if (reduceMotion || !type) return;
        void app.offsetWidth;
        app.classList.add("motion-" + type);
      }

      function addDays(dateText, delta) {
        var parts = String(dateText).split("-").map(Number);
        var date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + delta));
        return date.toISOString().slice(0, 10);
      }

      function appStatePath() {
        return selectedFitnessDate
          ? "/api/app-state?fitness_date=" + encodeURIComponent(selectedFitnessDate)
          : "/api/app-state";
      }

      async function api(path, body) {
        var payload = body;
        if (payload && typeof payload === "object" && !Array.isArray(payload) && !payload.fitness_date) {
          payload = Object.assign({ fitness_date: selectedFitnessDate || (state && state.fitness && state.fitness.date) }, payload);
        }
        var options = {
          method: payload === undefined ? "GET" : "POST",
          headers: {
            "content-type": "application/json",
            "x-telegram-init-data": tg ? tg.initData : ""
          }
        };
        if (payload !== undefined) {
          options.body = JSON.stringify(payload);
        }
        var response = await fetch(path, options);
        var data = await response.json().catch(function () {
          return { ok: false, error: "Server javobi o'qilmadi." };
        });
        if (!response.ok || !data.ok) {
          throw new Error(data.error || "So'rov bajarilmadi.");
        }
        return data;
      }

      async function refresh() {
        if (busy) return;
        busy = true;
        setStatus("Yangilanmoqda...");
        try {
          var data = await api(appStatePath());
          state = data.state;
          selectedFitnessDate = state.fitness.date;
          render(pendingMotion || "fade");
          pendingMotion = null;
          setStatus("Yangilandi: " + state.now.time);
        } catch (error) {
          setStatus(error.message, true);
        } finally {
          busy = false;
        }
      }

      async function mutate(path, body, message) {
        if (busy) return;
        busy = true;
        setStatus("Saqlanmoqda...");
        try {
          var data = await api(path, body);
          state = data.state;
          selectedFitnessDate = state.fitness.date;
          render("update");
          setStatus(message || "Saqlandi.");
          if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred("light");
          }
        } catch (error) {
          setStatus(error.message, true);
          if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred("error");
          }
        } finally {
          busy = false;
        }
      }

      function setActiveTab(tab) {
        activeTab = tab;
        Array.prototype.forEach.call(document.querySelectorAll("[data-tab]"), function (button) {
          button.classList.toggle("active", button.getAttribute("data-tab") === tab);
        });
        render("tab");
      }

      function changeFitnessDate(delta) {
        if (!state || activeTab !== "fitness" || busy) return;
        selectedFitnessDate = addDays(state.fitness.date, delta);
        pendingMotion = delta > 0 ? "next" : "prev";
        refresh();
      }

      function render(motion) {
        if (!state) {
          app.innerHTML = '<section class="panel"><div class="panel-head"><h2>Yuklanmoqda</h2></div></section>';
          runMotion(motion);
          return;
        }
        metaEl.textContent = state.now.date + " • " + state.now.time;
        if (activeTab === "fitness") renderFitness();
        if (activeTab === "prayer") renderPrayer();
        if (activeTab === "qazo") renderQazo();
        if (activeTab === "tasbeh") renderTasbeh();
        runMotion(motion);
      }

      function renderFitness() {
        var fitness = state.fitness;
        var percent = fitness.total ? Math.round((fitness.completed / fitness.total) * 100) : 0;
        var rows = fitness.tasks.map(function (task) {
          return '<button class="row ' + (task.done ? "done" : "") + '" data-action="checklist-toggle" data-index="' + task.index + '">' +
            '<span class="check">' + (task.done ? "✓" : "") + '</span>' +
            '<span class="label">' + escapeText(task.text) + '</span>' +
            '<span class="time">' + (task.done ? "done" : "") + '</span>' +
          '</button>';
        }).join("");
        app.innerHTML =
          '<section class="panel with-bg theme-fitness">' +
            '<div class="panel-head">' +
              '<div class="day-nav">' +
                '<button data-action="fitness-prev" aria-label="Oldingi kun">&lsaquo;</button>' +
                '<div class="date-pill"><strong>' + escapeText(fitness.title) + '</strong><span>' + escapeText(fitness.date) + '</span></div>' +
                '<button data-action="fitness-next" aria-label="Keyingi kun">&rsaquo;</button>' +
              '</div>' +
              '<div class="summary">' +
                '<span>' + escapeText(fitness.workout) + '</span>' +
                '<span>Treadmill: ' + escapeText(fitness.treadmill) + '</span>' +
                '<span>Zina: ' + escapeText(fitness.stair) + '</span>' +
                '<strong>' + fitness.completed + " / " + fitness.total + ' bajarildi</strong>' +
              '</div>' +
              '<div class="progress"><span style="width:' + percent + '%"></span></div>' +
            '</div>' +
            '<div class="list">' + rows + '</div>' +
            '<div class="actions">' +
              '<button data-action="checklist-all" class="primary">Hammasi</button>' +
              '<button data-action="checklist-reset">Reset</button>' +
            '</div>' +
          '</section>';
      }

      function prayerStatusText(row) {
        if (row.doneStatus === "done") return "O'qildi";
        if (row.doneStatus === "qazo" || row.doneStatus === "auto_qazo") return "Qazo";
        if (row.isOpen) return "Vaqti kirgan";
        if (row.isDue) return "Tekshirilmoqda";
        return "Kutilmoqda";
      }

      function renderPrayer() {
        var prayer = state.prayer;
        var sunrise = prayer.sunrise && prayer.sunrise.time ? '<span>Quyosh: ' + escapeText(prayer.sunrise.time) + '</span>' : '';
        var rows = prayer.rows.map(function (row) {
          var disabled = row.doneStatus ? " disabled" : "";
          return '<div class="row prayer-row">' +
            '<span><strong>' + escapeText(row.label) + '</strong><br><small>' + escapeText(prayerStatusText(row)) + '</small></span>' +
            '<span class="time">' + escapeText(row.time) + '</span>' +
            '<div class="prayer-actions">' +
              '<button data-action="prayer-done" data-key="' + escapeText(row.key) + '"' + disabled + '>O&apos;qidim</button>' +
              '<button data-action="prayer-qazo" data-key="' + escapeText(row.key) + '" class="danger"' + disabled + '>Qazo</button>' +
            '</div>' +
          '</div>';
        }).join("");
        app.innerHTML =
          '<section class="panel with-bg theme-prayer">' +
            '<div class="panel-head">' +
              '<h2>Namoz vaqtlari</h2>' +
              '<div class="summary">' +
                '<span>' + escapeText(prayer.date) + ' • ' + escapeText(prayer.city || "") + '</span>' +
                '<span>Manba: ' + escapeText(prayer.source || "") + '</span>' +
                sunrise +
              '</div>' +
            '</div>' +
            '<div class="list">' + rows + '</div>' +
          '</section>';
      }

      function renderQazo() {
        var rows = state.qazo.counts.map(function (item) {
          return '<div class="qazo-row">' +
            '<strong>' + escapeText(item.label) + '</strong>' +
            '<button data-action="qazo-minus" data-key="' + escapeText(item.key) + '">−</button>' +
            '<input inputmode="numeric" pattern="[0-9]*" min="0" type="number" data-qazo-input="' + escapeText(item.key) + '" value="' + Number(item.count || 0) + '">' +
            '<button data-action="qazo-plus" data-key="' + escapeText(item.key) + '">+</button>' +
          '</div>';
        }).join("");
        app.innerHTML =
          '<section class="panel with-bg theme-qazo">' +
            '<div class="panel-head">' +
              '<h2>Qazo panel</h2>' +
              '<div class="summary"><strong>Jami qazo: ' + state.qazo.total + '</strong><span>Raqamlarni o\\'zgartirib saqlash mumkin.</span></div>' +
            '</div>' +
            '<div class="list">' + rows + '</div>' +
            '<div class="actions">' +
              '<button data-action="qazo-save" class="primary">Saqlash</button>' +
              '<button data-action="refresh">Yangilash</button>' +
            '</div>' +
          '</section>';
      }

      function renderTasbeh() {
        var tasbeh = state.tasbeh;
        var percent = tasbeh.target ? Math.round((tasbeh.current / tasbeh.target) * 100) : 0;
        var zikr = tasbeh.zikr || {};
        app.innerHTML =
          '<section class="panel with-bg theme-tasbeh">' +
            '<div class="panel-head">' +
              '<div class="tasbeh-head">' +
                '<div>' +
                  '<h2>' + escapeText(zikr.text || "Tasbeh") + '</h2>' +
                  '<div class="summary"><span>' + escapeText(zikr.note || "") + '</span><span>' + (tasbeh.zikrIndex + 1) + ' / ' + tasbeh.zikrs.length + ' zikr</span></div>' +
                '</div>' +
                '<div class="tasbeh-total"><strong>' + Number(tasbeh.total || 0) + '</strong><span>jami</span></div>' +
              '</div>' +
              '<div class="progress"><span style="width:' + percent + '%"></span></div>' +
            '</div>' +
            '<div class="segmented">' +
              '<button data-action="tasbeh-target" data-target="33" class="' + (tasbeh.target === 33 ? "active" : "") + '">33 talik</button>' +
              '<button data-action="tasbeh-target" data-target="99" class="' + (tasbeh.target === 99 ? "active" : "") + '">99 talik</button>' +
            '</div>' +
            '<div class="tasbeh-counter">' +
              '<button class="tasbeh-button" data-action="tasbeh-count" aria-label="Tasbeh sanash">' +
                '<span class="tasbeh-count"><strong>' + Number(tasbeh.current || 0) + '</strong><span>' + escapeText(tasbeh.progress) + '</span></span>' +
              '</button>' +
            '</div>' +
            '<div class="actions">' +
              '<button data-action="tasbeh-next">Keyingi zikr</button>' +
              '<button data-action="tasbeh-reset">Joriy reset</button>' +
            '</div>' +
          '</section>';
      }

      document.addEventListener("click", function (event) {
        var tab = event.target.closest("[data-tab]");
        if (tab) {
          setActiveTab(tab.getAttribute("data-tab"));
          return;
        }

        var target = event.target.closest("[data-action]");
        if (!target || !state) return;
        var action = target.getAttribute("data-action");

        if (action === "refresh") {
          refresh();
        } else if (action === "fitness-prev") {
          changeFitnessDate(-1);
        } else if (action === "fitness-next") {
          changeFitnessDate(1);
        } else if (action === "checklist-toggle") {
          mutate("/api/checklist-toggle", {
            date: state.fitness.date,
            index: Number(target.getAttribute("data-index"))
          }, "Checklist yangilandi.");
        } else if (action === "checklist-all") {
          mutate("/api/checklist-toggle", { date: state.fitness.date, action: "all" }, "Hammasi belgilandi.");
        } else if (action === "checklist-reset") {
          mutate("/api/checklist-toggle", { date: state.fitness.date, action: "reset" }, "Checklist tozalandi.");
        } else if (action === "qazo-plus" || action === "qazo-minus") {
          mutate("/api/qazo-adjust", {
            key: target.getAttribute("data-key"),
            delta: action === "qazo-plus" ? 1 : -1
          }, "Qazo hisobi yangilandi.");
        } else if (action === "qazo-save") {
          var counts = {};
          Array.prototype.forEach.call(document.querySelectorAll("[data-qazo-input]"), function (input) {
            counts[input.getAttribute("data-qazo-input")] = Math.max(0, Number(input.value || 0));
          });
          mutate("/api/qazo-bulk", { counts: counts }, "Qazo sonlari saqlandi.");
        } else if (action === "tasbeh-count") {
          mutate("/api/tasbeh", { action: "increment" }, "Tasbeh saqlandi.");
        } else if (action === "tasbeh-target") {
          mutate("/api/tasbeh", {
            action: "set_target",
            target: Number(target.getAttribute("data-target"))
          }, "Tasbeh turi tanlandi.");
        } else if (action === "tasbeh-next") {
          mutate("/api/tasbeh", { action: "next" }, "Keyingi zikr.");
        } else if (action === "tasbeh-reset") {
          mutate("/api/tasbeh", { action: "reset_current" }, "Joriy zikr tozalandi.");
        } else if (action === "prayer-done" || action === "prayer-qazo") {
          mutate("/api/prayer-done", {
            date: state.prayer.date,
            key: target.getAttribute("data-key"),
            status: action === "prayer-qazo" ? "qazo" : "done"
          }, "Namoz holati yangilandi.");
        }
      });

      document.addEventListener("touchstart", function (event) {
        if (activeTab !== "fitness" || !event.touches || event.touches.length !== 1) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      }, { passive: true });

      document.addEventListener("touchend", function (event) {
        if (activeTab !== "fitness" || !event.changedTouches || event.changedTouches.length !== 1) return;
        var dx = event.changedTouches[0].clientX - touchStartX;
        var dy = event.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
        changeFitnessDate(dx < 0 ? 1 : -1);
      }, { passive: true });

      refresh();
    }());
  </script>
</body>
</html>`, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function sendInlineChecklist(env, chatId, targetDate, notice = null, options = {}) {
  if (notice) {
    await sendTelegram(env, chatId, notice, null, options);
  }
  const mask = await getChecklistMask(env, chatId, targetDate);
  await sendTelegram(env, chatId, buildInlineChecklistText(targetDate, env, mask), inlineChecklistKeyboard(targetDate, env, mask), options);
}

function wantsChecklist(text) {
  const normalized = normalizeCommand(text);
  return (
    normalized === "/checklist" ||
    normalized.includes("checklist") ||
    normalized.includes("cheklist")
  );
}

function wantsNativeChecklist(text) {
  const normalized = normalizeCommand(text);
  return normalized === "/native" || normalized.includes("native");
}

function wantsToday(text) {
  const normalized = normalizeCommand(text);
  return (
    normalized === "/today" ||
    normalized.includes("bugun") ||
    normalized.includes("nima qilish") ||
    normalized.includes("mashq")
  );
}

function wantsTomorrow(text) {
  const normalized = normalizeCommand(text);
  return normalized === "/tomorrow" || normalized.includes("ertaga") || normalized.includes("tomorrow");
}

function wantsReset(text) {
  const normalized = normalizeCommand(text);
  return normalized === "/reset" || normalized.includes("reset") || normalized.includes("tozala");
}

function wantsStatus(text) {
  const normalized = normalizeCommand(text);
  return normalized === "/status";
}

function isAllowedChat(env, chatId) {
  const allowed = [env.TELEGRAM_CHAT_ID, env.NATIVE_CHECKLIST_CHAT_ID, env.PRAYER_CHAT_ID, env.TELEGRAM_ALLOWED_CHAT_IDS]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return allowed.length === 0 || allowed.includes(String(chatId));
}

async function answerCallback(env, callbackQueryId, text) {
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}

function responseFor(text, env) {
  const normalized = normalizeCommand(text);
  if (normalized === "/start" || normalized === "/help" || normalized.includes("yordam")) {
    return helpMessage();
  }
  if (normalized === "/app") {
    return "Mini Appni ochish uchun pastdagi tugmadan foydalaning.";
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
  return "Tushundim. Fitness uchun <b>/today</b>, namoz uchun <b>/namoz</b>, qazo panel uchun <b>/qazo</b>, Mini App uchun <b>/app</b> deb yozing.";
}

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runPrayerReminder(env).catch((error) => console.error(error)));
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/app") {
      return miniAppHtml();
    }
    if (url.pathname.startsWith("/api/")) {
      return handleMiniAppApi(request, env);
    }
    if (request.method !== "POST") {
      return new Response("Fitness bot is running. Mini App: /app");
    }

    const update = await request.json();
    if (update.business_connection) {
      const connection = update.business_connection;
      const status = connection.is_enabled ? "ulandi" : "uzildi";
      const text = [
        `Business connection ${status}.`,
        "",
        `BUSINESS_CONNECTION_ID:`,
        `<code>${escapeHtml(connection.id)}</code>`,
        "",
        "Cloudflare Worker secret/variable sifatida BUSINESS_CONNECTION_ID qo'shing.",
      ].join("\n");
      if (env.TELEGRAM_CHAT_ID) {
        await sendTelegram(env, env.TELEGRAM_CHAT_ID, text, null, threadOptions(env.TELEGRAM_TOPIC_ID));
      }
      return new Response("OK");
    }

    const callback = update.callback_query;
    if (callback && callback.message && callback.data) {
      const chatId = callback.message.chat.id;
      const threadId = threadFromMessage(callback.message, env);
      if (!isAllowedChat(env, chatId)) {
        await answerCallback(env, callback.id, "Bu bot shaxsiy foydalanish uchun sozlangan.");
        return new Response("OK");
      }

      if (callback.data.startsWith("prd:")) {
        const [, dateKey, prayerKey] = callback.data.split(":");
        const targetSchedule = await getPrayerSchedule(env, dateKey);
        const prayer = targetSchedule.timings.find((item) => item.key === prayerKey);
        if (!prayer) {
          await answerCallback(env, callback.id, "Namoz topilmadi.");
          return new Response("OK");
        }
        await markPrayerDone(env, chatId, dateKey, prayerKey, "done");
        await editTelegramMessage(
          env,
          chatId,
          callback.message.message_id,
          buildPrayerDoneText(targetSchedule, prayer, "done"),
          null,
          threadOptions(threadId)
        );
        await answerCallback(env, callback.id, "O'qildi deb belgilandi.");
      } else if (callback.data.startsWith("prq:")) {
        const [, dateKey, prayerKey] = callback.data.split(":");
        const targetSchedule = await getPrayerSchedule(env, dateKey);
        const prayer = targetSchedule.timings.find((item) => item.key === prayerKey);
        if (!prayer) {
          await answerCallback(env, callback.id, "Namoz topilmadi.");
          return new Response("OK");
        }
        const qazoKeys = missedQazoKeys(prayerKey, prayerKey === "isha");
        for (const key of qazoKeys) {
          await adjustQazoCount(env, chatId, key, 1);
        }
        await markPrayerDone(env, chatId, dateKey, prayerKey, "qazo");
        await editTelegramMessage(
          env,
          chatId,
          callback.message.message_id,
          buildPrayerDoneText(targetSchedule, prayer, "qazo", qazoKeys),
          null,
          threadOptions(threadId)
        );
        await upsertQazoDashboard(env, chatId, threadId, `${qazoKeys.map(qazoPrayerLabel).join(" + ")} qazo hisobiga qo'shildi.`);
        await answerCallback(env, callback.id, "Qazo hisobiga qo'shildi.");
      } else if (callback.data.startsWith("qz:")) {
        const [, action, prayerKey] = callback.data.split(":");
        const prayer = QAZO_PRAYERS.find((item) => item.key === prayerKey);
        if (action === "show") {
          await upsertQazoDashboard(env, chatId, threadId);
          await answerCallback(env, callback.id, "Qazo panel yangilandi.");
        } else if (action === "template") {
          await sendTelegram(env, chatId, qazoBulkTemplateMessage(), null, threadOptions(threadId));
          await answerCallback(env, callback.id, "Qo'lda kiritish namunasi yuborildi.");
        } else if (action === "refresh") {
          await editTelegramMessage(
            env,
            chatId,
            callback.message.message_id,
            await buildQazoDashboardText(env, chatId),
            qazoDashboardKeyboard(),
            threadOptions(threadId)
          );
          await kvPut(env, qazoDashboardKey(chatId, threadId), callback.message.message_id, 60 * 60 * 24 * 365 * 5);
          await answerCallback(env, callback.id, "Qazo panel yangilandi.");
        } else if (prayer && ["+", "-"].includes(action)) {
          await adjustQazoCount(env, chatId, prayer.key, action === "+" ? 1 : -1);
          await editTelegramMessage(
            env,
            chatId,
            callback.message.message_id,
            await buildQazoDashboardText(env, chatId),
            qazoDashboardKeyboard(),
            threadOptions(threadId)
          );
          await kvPut(env, qazoDashboardKey(chatId, threadId), callback.message.message_id, 60 * 60 * 24 * 365 * 5);
          await answerCallback(env, callback.id, "Qazo hisobi yangilandi.");
        } else {
          await answerCallback(env, callback.id, "Qazo tugmasi tushunarsiz.");
        }
      } else if (callback.data === "namoz:today") {
        await editTelegramMessage(
          env,
          chatId,
          callback.message.message_id,
          await buildPrayerStatusText(env, chatId),
          prayerStatusKeyboard(),
          threadOptions(threadId)
        );
        await answerCallback(env, callback.id, "Namoz holati yangilandi.");
      } else if (callback.data.startsWith("tgl:")) {
        const [, dateText, maskText, indexText] = callback.data.split(":");
        const targetDate = dateFromCallback(dateText);
        const currentMask = env.CHECKLIST_STATE
          ? await getChecklistMask(env, chatId, targetDate)
          : Number(maskText || 0);
        const nextMask = currentMask ^ (1 << Number(indexText));
        await setChecklistMask(env, chatId, targetDate, nextMask);
        await editTelegramMessage(
          env,
          chatId,
          callback.message.message_id,
          buildInlineChecklistText(targetDate, env, nextMask),
          inlineChecklistKeyboard(targetDate, env, nextMask),
          threadOptions(threadId)
        );
        await answerCallback(env, callback.id, "Checklist yangilandi.");
      } else if (callback.data.startsWith("rst:")) {
        const [, dateText] = callback.data.split(":");
        const targetDate = dateFromCallback(dateText);
        await setChecklistMask(env, chatId, targetDate, 0);
        await editTelegramMessage(
          env,
          chatId,
          callback.message.message_id,
          buildInlineChecklistText(targetDate, env, 0),
          inlineChecklistKeyboard(targetDate, env, 0),
          threadOptions(threadId)
        );
        await answerCallback(env, callback.id, "Checklist tozalandi.");
      } else if (callback.data.startsWith("all:")) {
        const [, dateText, allMaskText] = callback.data.split(":");
        const targetDate = dateFromCallback(dateText);
        const nextMask = Number(allMaskText || 0);
        await setChecklistMask(env, chatId, targetDate, nextMask);
        await editTelegramMessage(
          env,
          chatId,
          callback.message.message_id,
          buildInlineChecklistText(targetDate, env, nextMask),
          inlineChecklistKeyboard(targetDate, env, nextMask),
          threadOptions(threadId)
        );
        await answerCallback(env, callback.id, "Hammasi belgilandi.");
      } else if (callback.data.startsWith("toggle:")) {
        const [, maskText, indexText] = callback.data.split(":");
        const currentMask = env.CHECKLIST_STATE
          ? await getChecklistMask(env, chatId, tashkentDate(0))
          : Number(maskText || 0);
        const nextMask = indexText === "reset" ? 0 : currentMask ^ (1 << Number(indexText));
        await setChecklistMask(env, chatId, tashkentDate(0), nextMask);
        await editTelegramMessage(
          env,
          chatId,
          callback.message.message_id,
          buildInlineChecklistText(tashkentDate(0), env, nextMask),
          inlineChecklistKeyboard(tashkentDate(0), env, nextMask),
          threadOptions(threadId)
        );
        await answerCallback(env, callback.id, "Checklist yangilandi.");
      } else if (callback.data === "reset_today") {
        await setChecklistMask(env, chatId, tashkentDate(0), 0);
        await sendInlineChecklist(env, chatId, tashkentDate(0), "Bugungi checklist tozalandi.", threadOptions(threadId));
        await answerCallback(env, callback.id, "Checklist tozalandi.");
      } else if (callback.data === "tomorrow") {
        await answerCallback(env, callback.id, "Ertangi reja yuborildi.");
        await sendInlineChecklist(env, chatId, tashkentDate(1), null, threadOptions(threadId));
      } else if (callback.data === "help") {
        await answerCallback(env, callback.id, "Yordam yuborildi.");
        await sendTelegram(
          env,
          chatId,
          helpMessage(),
          workoutKeyboard(env, request.url, callback.message.chat.type === "private"),
          threadOptions(threadId)
        );
      } else {
        await answerCallback(env, callback.id, "Bugungi reja yuborildi.");
        await sendInlineChecklist(env, chatId, tashkentDate(0), null, threadOptions(threadId));
      }
      return new Response("OK");
    }

    const message = update.business_message || update.message;
    if (!message || !message.chat || !message.text) {
      return new Response("OK");
    }

    const isBusinessMessage = Boolean(update.business_message);
    const businessConnectionId = message.business_connection_id || env.BUSINESS_CONNECTION_ID;
    const normalizedText = normalizeCommand(message.text);
    const threadId = threadFromMessage(message, env);

    if (normalizedText === "/threadid") {
      await sendTelegram(
        env,
        message.chat.id,
        [
          "Chat ID:",
          `<code>${escapeHtml(message.chat.id)}</code>`,
          "",
          `Chat type: <code>${escapeHtml(message.chat.type || "unknown")}</code>`,
          "",
          "Topic / thread ID:",
          `<code>${escapeHtml(message.message_thread_id || "general")}</code>`,
        ].join("\n")
        ,
        null,
        threadOptions(threadId)
      );
      return new Response("OK");
    }

    if (normalizedText === "/chatid") {
      await sendTelegram(
        env,
        message.chat.id,
        [
          "Chat ID:",
          `<code>${escapeHtml(message.chat.id)}</code>`,
          "",
          `Chat type: <code>${escapeHtml(message.chat.type || "unknown")}</code>`,
          "",
          "Topic / thread ID:",
          `<code>${escapeHtml(message.message_thread_id || "general")}</code>`,
        ].join("\n"),
        null,
        threadOptions(threadId)
      );
      return new Response("OK");
    }

    if (!isBusinessMessage && !isAllowedChat(env, message.chat.id)) {
      await sendTelegram(env, message.chat.id, "Bu bot shaxsiy foydalanish uchun sozlangan.");
      return new Response("OK");
    }

    const qazoBulkCommand = parseQazoBulkCommand(message.text);
    if (qazoBulkCommand) {
      if (qazoBulkCommand.error) {
        await sendTelegram(env, message.chat.id, qazoBulkTemplateMessage(), null, threadOptions(threadId));
        return new Response("OK");
      }

      for (const [prayerKey, count] of Object.entries(qazoBulkCommand.assignments)) {
        await setQazoCount(env, message.chat.id, prayerKey, count);
      }
      await upsertQazoDashboard(env, message.chat.id, threadId, "Qazo sonlari qo'lda kiritildi.");
      return new Response("OK");
    }

    const qazoCommand = parseQazoCommand(message.text);
    if (qazoCommand) {
      if (qazoCommand.error) {
        await sendTelegram(env, message.chat.id, qazoUsageMessage(), null, threadOptions(threadId));
        return new Response("OK");
      }

      if (qazoCommand.type === "set") {
        await setQazoCount(env, message.chat.id, qazoCommand.prayer.key, qazoCommand.amount);
      } else {
        const delta = qazoCommand.type === "add" ? qazoCommand.amount : -qazoCommand.amount;
        await adjustQazoCount(env, message.chat.id, qazoCommand.prayer.key, delta);
      }
      await upsertQazoDashboard(env, message.chat.id, threadId, `${qazoCommand.prayer.label} qazo hisobi yangilandi.`);
      return new Response("OK");
    }

    if (wantsNamoz(message.text)) {
      await sendTelegram(env, message.chat.id, await buildPrayerStatusText(env, message.chat.id), prayerStatusKeyboard(), threadOptions(threadId));
      await upsertQazoDashboard(env, message.chat.id, threadId);
      return new Response("OK");
    }

    if (wantsQazo(message.text)) {
      await upsertQazoDashboard(env, message.chat.id, threadId);
      return new Response("OK");
    }

    if (wantsStatus(message.text)) {
      await sendTelegram(
        env,
        message.chat.id,
        statusMessage(env, message.chat.id),
        workoutKeyboard(env, request.url, message.chat.type === "private"),
        threadOptions(threadId)
      );
      return new Response("OK");
    }

    if (normalizedText === "/app") {
      const canOpenMiniApp = message.chat.type === "private";
      await sendTelegram(
        env,
        message.chat.id,
        canOpenMiniApp
          ? "Mini Appni ochish uchun tugmani bosing."
          : "Telegram Mini App tugmasi private chatda ochiladi. Botga private chatda /app yuboring.",
        workoutKeyboard(env, request.url, canOpenMiniApp),
        threadOptions(threadId)
      );
      return new Response("OK");
    }

    if (normalizedText === "/start" || normalizedText === "/help" || normalizedText.includes("yordam")) {
      await sendTelegram(
        env,
        message.chat.id,
        helpMessage(),
        workoutKeyboard(env, request.url, message.chat.type === "private"),
        threadOptions(threadId)
      );
      return new Response("OK");
    }

    if (wantsReset(message.text)) {
      await setChecklistMask(env, message.chat.id, tashkentDate(0), 0);
      await sendInlineChecklist(env, message.chat.id, tashkentDate(0), "Bugungi checklist tozalandi.", threadOptions(threadId));
      return new Response("OK");
    }

    if (wantsTomorrow(message.text)) {
      await sendInlineChecklist(env, message.chat.id, tashkentDate(1), null, threadOptions(threadId));
      return new Response("OK");
    }

    if (wantsNativeChecklist(message.text) && businessConnectionId) {
      try {
        await sendNativeChecklist(env, businessConnectionId, message.chat.id, tashkentDate(0));
      } catch (error) {
        const notice = [
          "Native checklist Telegram tomonidan rad etildi.",
          "Inline checklist yuborildi.",
          "",
          `<code>${escapeHtml(error.message)}</code>`,
        ].join("\n");
        await sendInlineChecklist(env, message.chat.id, tashkentDate(0), notice, threadOptions(threadId));
      }
      return new Response("OK");
    }

    if (wantsChecklist(message.text) || wantsToday(message.text)) {
      await sendInlineChecklist(env, message.chat.id, tashkentDate(0), null, threadOptions(threadId));
      return new Response("OK");
    }

    await sendTelegram(
      env,
      message.chat.id,
      responseFor(message.text, env),
      workoutKeyboard(env, request.url, message.chat.type === "private"),
      threadOptions(threadId)
    );
    return new Response("OK");
  },
};
