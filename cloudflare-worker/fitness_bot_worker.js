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

function dateFromCallback(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? parseDate(value) : tashkentDate(0);
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
    "• /status - bot sozlamalarini tekshirish",
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
    throw new Error(`Telegram API failed: ${response.status}`);
  }
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
    throw new Error(`Telegram editMessageText failed: ${response.status}`);
  }
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

async function sendInlineChecklist(env, chatId, targetDate, notice = null, options = {}) {
  if (notice) {
    await sendTelegram(env, chatId, notice, null, options);
  }
  const mask = await getChecklistMask(env, chatId, targetDate);
  await sendTelegram(env, chatId, buildInlineChecklistText(targetDate, env, mask), inlineChecklistKeyboard(targetDate, env, mask), options);
}

function wantsChecklist(text) {
  const normalized = text.toLowerCase().trim();
  return (
    normalized === "/checklist" ||
    normalized.includes("checklist") ||
    normalized.includes("cheklist")
  );
}

function wantsNativeChecklist(text) {
  const normalized = text.toLowerCase().trim();
  return normalized === "/native" || normalized.includes("native");
}

function wantsToday(text) {
  const normalized = text.toLowerCase().trim();
  return (
    normalized === "/today" ||
    normalized.includes("bugun") ||
    normalized.includes("nima qilish") ||
    normalized.includes("mashq")
  );
}

function wantsTomorrow(text) {
  const normalized = text.toLowerCase().trim();
  return normalized === "/tomorrow" || normalized.includes("ertaga") || normalized.includes("tomorrow");
}

function wantsReset(text) {
  const normalized = text.toLowerCase().trim();
  return normalized === "/reset" || normalized.includes("reset") || normalized.includes("tozala");
}

function wantsStatus(text) {
  const normalized = text.toLowerCase().trim();
  return normalized === "/status" || normalized.startsWith("/status@");
}

function isAllowedChat(env, chatId) {
  const allowed = [env.TELEGRAM_CHAT_ID, env.NATIVE_CHECKLIST_CHAT_ID, env.TELEGRAM_ALLOWED_CHAT_IDS]
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

      if (callback.data.startsWith("tgl:")) {
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
    const normalizedText = message.text.toLowerCase().trim();
    const threadId = threadFromMessage(message, env);

    if (normalizedText === "/threadid" || normalizedText.startsWith("/threadid@")) {
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

    if (normalizedText === "/chatid" || normalizedText.startsWith("/chatid@")) {
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
