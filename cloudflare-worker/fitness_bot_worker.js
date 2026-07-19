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

function workoutKeyboard() {
  return {
    inline_keyboard: [
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
    ],
  };
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
    "Nomlar: bomdod, peshin, asr, shom, xufton, vitr.",
  ].join("\n");
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
  return "Tushundim. Fitness uchun <b>/today</b>, namoz uchun <b>/namoz</b>, qazo panel uchun <b>/qazo</b> deb yozing.";
}

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runPrayerReminder(env).catch((error) => console.error(error)));
  },

  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Fitness bot is running.");
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
        await sendTelegram(env, chatId, helpMessage(), workoutKeyboard(), threadOptions(threadId));
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
      await sendTelegram(env, message.chat.id, statusMessage(env, message.chat.id), workoutKeyboard(), threadOptions(threadId));
      return new Response("OK");
    }

    if (normalizedText === "/start" || normalizedText === "/help" || normalizedText.includes("yordam")) {
      await sendTelegram(env, message.chat.id, helpMessage(), workoutKeyboard(), threadOptions(threadId));
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

    await sendTelegram(env, message.chat.id, responseFor(message.text, env), workoutKeyboard(), threadOptions(threadId));
    return new Response("OK");
  },
};
