const CONFIG = {
  columns: [
    { id: 2596315, key: "shooting_day", title: "Shooting day" },
    { id: 2596316, key: "shooting_process", title: "Shooting process" },
    { id: 2596317, key: "done", title: "DONE" },
  ],
  boardId: 725343,
  sheetName: "MIJOZLAR BAZASI",
  clientStartRow: 6,
  clientEndRow: 1000,
};

const APP_VERSION = "kaiten-miniapp-2026-07-19-11";

const ICON_PRESETS = [
  { value: "⭐️", label: "Syomka" },
  { value: "✂️", label: "Montaj" },
  { value: "🟢", label: "Podklyuch Reels" },
  { value: "⭐️🟢", label: "Syomka Reels" },
  { value: "✂️🟢", label: "Montaj Reels" },
  { value: "🔴", label: "Podcast" },
  { value: "🟡", label: "YouTube" },
  { value: "🚚⭐️🔴", label: "Vyezdnoy Podcast" },
  { value: "📷", label: "Fotosessiya" },
  { value: "💻", label: "Vebinar" },
  { value: "🏛️", label: "Seminar" },
  { value: "🧤🟡", label: "Rekomendatsiya YouTube" },
  { value: "🎯🟢", label: "Target Reels" },
];

const ROLE_LEVEL = {
  viewer: 1,
  editor: 2,
  admin: 3,
  owner: 4,
};

const UZ_MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

const CLIENT_CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;

let googleTokenCache = null;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function htmlResponse(html) {
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function base64UrlEncode(input) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToHex(base64Url) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(base64Url.length / 4) * 4, "=");
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function pemToArrayBuffer(pem) {
  const base64 = String(pem || "")
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
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

function bytesToHex(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
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

async function verifyTelegramInitData(initData, env) {
  if (env.MINI_APP_AUTH_DISABLED === "1") {
    return {
      ok: true,
      user: {
        id: Number(env.OWNER_TELEGRAM_ID || 8084782034),
        first_name: "Dev",
      },
      dev: true,
    };
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

function ownerId(env) {
  return String(env.OWNER_TELEGRAM_ID || "8084782034");
}

function userKey(telegramId) {
  return `user:${telegramId}`;
}

function auditKey() {
  return `audit:${Date.now()}:${crypto.randomUUID()}`;
}

function normalizeRole(role) {
  return ROLE_LEVEL[role] ? role : "viewer";
}

async function kvGetJson(env, key, fallback = null) {
  if (!env.KAITEN_STATE) {
    return fallback;
  }
  const raw = await env.KAITEN_STATE.get(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
}

async function kvPutJson(env, key, value, ttlSeconds = null) {
  if (!env.KAITEN_STATE) {
    return;
  }
  const options = ttlSeconds ? { expirationTtl: ttlSeconds } : undefined;
  await env.KAITEN_STATE.put(key, JSON.stringify(value), options);
}

async function kvDelete(env, key) {
  if (env.KAITEN_STATE) {
    await env.KAITEN_STATE.delete(key);
  }
}

async function audit(env, actor, action, payload = {}) {
  await kvPutJson(env, auditKey(), {
    actor: actor?.telegramId || "unknown",
    action,
    payload,
    at: new Date().toISOString(),
  }, 60 * 60 * 24 * 90);
}

async function listUsers(env) {
  const owner = {
    telegramId: ownerId(env),
    role: "owner",
    name: "Owner",
    source: "env",
  };
  if (!env.KAITEN_STATE || !env.KAITEN_STATE.list) {
    return [owner];
  }

  const result = await env.KAITEN_STATE.list({ prefix: "user:" });
  const users = [owner];
  for (const key of result.keys || []) {
    const user = await kvGetJson(env, key.name);
    if (user && String(user.telegramId) !== owner.telegramId) {
      users.push({
        telegramId: String(user.telegramId),
        role: normalizeRole(user.role),
        name: user.name || "",
        source: "kv",
      });
    }
  }
  return users;
}

async function getAuthorizedUser(env, auth) {
  const telegramId = String(auth.user?.id || "");
  if (!telegramId) {
    return null;
  }

  if (telegramId === ownerId(env)) {
    return {
      telegramId,
      role: "owner",
      name: auth.user?.first_name || "Owner",
    };
  }

  const stored = await kvGetJson(env, userKey(telegramId));
  if (stored) {
    return {
      telegramId,
      role: normalizeRole(stored.role),
      name: stored.name || auth.user?.first_name || "",
    };
  }

  const staticAllowed = String(env.ALLOWED_TELEGRAM_IDS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (staticAllowed.includes(telegramId)) {
    return {
      telegramId,
      role: "editor",
      name: auth.user?.first_name || "",
    };
  }

  return null;
}

function assertRole(user, role) {
  return ROLE_LEVEL[user?.role] >= ROLE_LEVEL[role];
}

function kaitenBaseUrl(env) {
  const domain = String(env.KAITEN_DOMAIN || "isoomedia").replace(/^https?:\/\//, "").replace(/\.kaiten\.ru\/?$/, "");
  return `https://${domain}.kaiten.ru/api/latest`;
}

function boardId(env) {
  return Number(env.KAITEN_BOARD_ID || CONFIG.boardId);
}

function columnConfig(env) {
  return [
    { id: Number(env.KAITEN_COLUMN_SHOOTING_DAY || CONFIG.columns[0].id), key: "shooting_day", title: "Shooting day" },
    { id: Number(env.KAITEN_COLUMN_SHOOTING_PROCESS || CONFIG.columns[1].id), key: "shooting_process", title: "Shooting process" },
    { id: Number(env.KAITEN_COLUMN_DONE || CONFIG.columns[2].id), key: "done", title: "DONE" },
  ];
}

function validColumnId(env, columnId) {
  const id = Number(columnId);
  return columnConfig(env).some((column) => column.id === id) ? id : null;
}

async function kaitenRequest(env, path, options = {}) {
  if (!env.KAITEN_API_TOKEN) {
    throw new Error("KAITEN_API_TOKEN sozlanmagan.");
  }
  const response = await fetch(`${kaitenBaseUrl(env)}${path}`, {
    ...options,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${env.KAITEN_API_TOKEN}`,
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Kaiten API ${response.status}: ${text.slice(0, 240)}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

function normalizeKaitenCard(card) {
  return {
    id: card.id,
    title: String(card.title || ""),
    columnId: card.column_id,
    boardId: card.board_id,
    sortOrder: card.sort_order || 0,
    state: card.state,
    commentsTotal: card.comments_total || 0,
    updated: card.updated,
    created: card.created,
    url: `https://isoomedia.kaiten.ru/card/${card.id}`,
  };
}

async function getKaitenCards(env) {
  const columns = columnConfig(env);
  const ids = columns.map((column) => column.id).join(",");
  const params = new URLSearchParams({
    board_id: String(boardId(env)),
    column_ids: ids,
    condition: "1",
    limit: "100",
    order_by: "sort_order",
    order_direction: "asc",
  });
  const data = await kaitenRequest(env, `/cards?${params}`);
  const rawCards = Array.isArray(data) ? data : data?.result || [];
  return rawCards
    .filter((card) => columns.some((column) => column.id === Number(card.column_id)))
    .map(normalizeKaitenCard);
}

async function createKaitenCard(env, title, columnId = null) {
  return normalizeKaitenCard(await kaitenRequest(env, "/cards", {
    method: "POST",
    body: JSON.stringify({
      title,
      board_id: boardId(env),
      column_id: Number(columnId || columnConfig(env)[0].id),
      position: 1,
    }),
  }));
}

async function updateKaitenCard(env, cardId, patch) {
  const body = {};
  if (patch.title !== undefined) {
    body.title = String(patch.title).trim();
  }
  if (patch.columnId !== undefined) {
    body.column_id = Number(patch.columnId);
  }
  return normalizeKaitenCard(await kaitenRequest(env, `/cards/${Number(cardId)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  }));
}

async function addKaitenComment(env, cardId, text) {
  const form = new FormData();
  form.append("text", String(text || ""));
  const response = await fetch(`${kaitenBaseUrl(env)}/cards/${Number(cardId)}/comments`, {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${env.KAITEN_API_TOKEN}`,
    },
    body: form,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kaiten comment ${response.status}: ${errorText.slice(0, 200)}`);
  }
  return response.json();
}

async function getGoogleServiceAccount(env) {
  if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON sozlanmagan.");
  }
  let account = null;
  if (typeof env.GOOGLE_SERVICE_ACCOUNT_JSON === "object") {
    account = env.GOOGLE_SERVICE_ACCOUNT_JSON;
  } else {
    const raw = String(env.GOOGLE_SERVICE_ACCOUNT_JSON || "").trim();
    try {
      account = JSON.parse(raw);
      if (typeof account === "string") {
        account = JSON.parse(account);
      }
    } catch (error) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON to'g'ri JSON emas. Secret value qismiga service account .json faylining to'liq matnini kiriting.");
    }
  }
  if (!account?.client_email || !account?.private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON ichida client_email yoki private_key topilmadi.");
  }
  return account;
}

async function getGoogleAccessToken(env) {
  if (env.GOOGLE_AUTH_DISABLED === "1") {
    return "dev-google-token";
  }

  if (googleTokenCache && googleTokenCache.expiresAt > Date.now() + 60000) {
    return googleTokenCache.token;
  }

  const account = await getGoogleServiceAccount(env);
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64UrlEncode(JSON.stringify({
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const signingInput = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(account.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signingInput));
  const assertion = `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Google OAuth ${response.status}: ${JSON.stringify(data).slice(0, 240)}`);
  }
  googleTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in || 3600) * 1000,
  };
  return googleTokenCache.token;
}

function spreadsheetId(env) {
  return env.GOOGLE_SHEET_ID || "1wQKc0kCXrnWrt-lqqg8oYXRBO6ai7LaiH8BlEthpr6U";
}

function sheetName(env) {
  return env.GOOGLE_SHEET_NAME || CONFIG.sheetName;
}

async function googleSheetsRequest(env, path, options = {}) {
  const token = await getGoogleAccessToken(env);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId(env)}${path}`, {
    ...options,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`Google Sheets ${response.status}: ${JSON.stringify(data).slice(0, 240)}`);
  }
  return data;
}

function normalizeClient(row, index) {
  return {
    row: CONFIG.clientStartRow + index,
    name: String(row[0] || "").trim(),
    company: String(row[21] || "").trim(),
    phone: String(row[22] || "").trim(),
    note: String(row[23] || "").trim(),
  };
}

function normalizeClientName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function updatedRangeRow(updatedRange) {
  const match = String(updatedRange || "").match(/![A-Z]+(\d+)/i);
  return match ? Number(match[1]) : null;
}

async function getClients(env, force = false) {
  const cacheKey = "clients:cache";
  if (!force) {
    const cached = await kvGetJson(env, cacheKey);
    if (Array.isArray(cached)) {
      return cached;
    }
    if (Array.isArray(cached?.items)) {
      return cached.items;
    }
  }
  const range = encodeURIComponent(`${sheetName(env)}!A${CONFIG.clientStartRow}:X${CONFIG.clientEndRow}`);
  const data = await googleSheetsRequest(env, `/values/${range}`);
  const clients = (data.values || [])
    .map(normalizeClient)
    .filter((client) => client.name);
  await kvPutJson(env, cacheKey, clients, CLIENT_CACHE_TTL_SECONDS);
  await kvPutJson(env, "clients:cache:updatedAt", new Date().toISOString(), CLIENT_CACHE_TTL_SECONDS);
  return clients;
}

async function putClientsCache(env, clients) {
  await kvPutJson(env, "clients:cache", clients, CLIENT_CACHE_TTL_SECONDS);
  await kvPutJson(env, "clients:cache:updatedAt", new Date().toISOString(), CLIENT_CACHE_TTL_SECONDS);
}

async function primeClientCache(env, client) {
  let clients = [];
  try {
    clients = await getClients(env, true);
  } catch (_) {
    const cached = await kvGetJson(env, "clients:cache");
    clients = Array.isArray(cached) ? cached : Array.isArray(cached?.items) ? cached.items : [];
  }

  const normalizedName = normalizeClientName(client.name);
  const cachedClient = {
    row: client.row || null,
    name: client.name,
    company: client.company || "",
    phone: client.phone || "",
    note: client.note || "",
  };
  const existingIndex = clients.findIndex((item) => normalizeClientName(item.name) === normalizedName);
  if (existingIndex >= 0) {
    clients[existingIndex] = { ...clients[existingIndex], ...cachedClient };
  } else {
    clients.push(cachedClient);
  }
  await putClientsCache(env, clients);
  return cachedClient;
}

async function appendClient(env, client) {
  const fullName = String(client.name || `${client.firstName || ""} ${client.lastName || ""}`).trim();
  if (!fullName) {
    throw new Error("Mijoz ismi kiritilmagan.");
  }
  const existingClients = await getClients(env).catch(() => []);
  const existingClient = existingClients.find((item) => normalizeClientName(item.name) === normalizeClientName(fullName));
  if (existingClient) {
    return {
      ...existingClient,
      alreadyExists: true,
      updatedRange: null,
    };
  }
  const row = Array(24).fill("");
  row[0] = fullName;
  row[21] = String(client.company || "").trim();
  row[22] = String(client.phone || "").trim();
  row[23] = String(client.note || "").trim();
  const range = encodeURIComponent(`${sheetName(env)}!A:X`);
  const data = await googleSheetsRequest(
    env,
    `/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      body: JSON.stringify({ values: [row] }),
    }
  );
  const createdClient = {
    row: updatedRangeRow(data.updates?.updatedRange),
    name: fullName,
    company: row[21],
    phone: row[22],
    note: row[23],
    updatedRange: data.updates?.updatedRange,
  };
  await primeClientCache(env, createdClient);
  return createdClient;
}

function uzDateTitle(dateValue) {
  const [year, month, day] = String(dateValue || "").split("-").map(Number);
  if (!year || !month || !day) {
    return "";
  }
  return `${day}-${UZ_MONTHS[month - 1]}`;
}

function buildCardTitle(body) {
  const icon = String(body.icon || "").trim();
  const date = uzDateTitle(body.date);
  const startTime = String(body.startTime || "").trim();
  const endTime = String(body.endTime || "").trim();
  const time = String(body.time || (startTime && endTime ? `${startTime}-${endTime}` : startTime)).trim();
  const client = String(body.clientName || "").trim();
  return [icon ? `${icon}${date}` : date, time, client].filter(Boolean).join(" ").trim();
}

async function sendTelegram(env, chatId, text, replyMarkup = null) {
  if (!env.TELEGRAM_BOT_TOKEN) {
    return null;
  }
  const body = { chat_id: chatId, text, parse_mode: "HTML" };
  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.ok ? response.json() : null;
}

async function setTelegramMenuButton(env, requestUrl) {
  const url = appUrl(env, requestUrl);
  if (!env.TELEGRAM_BOT_TOKEN || !url) {
    return null;
  }
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setChatMenuButton`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      menu_button: {
        type: "web_app",
        text: "ISOMEDIA",
        web_app: { url },
      },
    }),
  });
  return response.ok ? response.json() : null;
}

function appUrl(env, requestUrl = null) {
  if (env.MINI_APP_URL) {
    return env.MINI_APP_URL;
  }
  return requestUrl ? new URL("/app", requestUrl).toString() : null;
}

function startKeyboard(env, requestUrl) {
  const url = appUrl(env, requestUrl);
  return url
    ? { inline_keyboard: [[{ text: "ISOMEDIA Mini App", web_app: { url } }]] }
    : null;
}

async function buildState(env, user) {
  const [cards, clients, clientsUpdatedAt, users] = await Promise.all([
    getKaitenCards(env),
    getClients(env).catch((error) => ({ error: error.message, items: [] })),
    kvGetJson(env, "clients:cache:updatedAt"),
    assertRole(user, "admin") ? listUsers(env) : Promise.resolve([]),
  ]);
  return {
    user,
    config: {
      boardId: boardId(env),
      columns: columnConfig(env),
      iconPresets: ICON_PRESETS,
    },
    cards: Array.isArray(cards) ? cards : [],
    clients: Array.isArray(clients) ? clients : [],
    clientsError: clients?.error || null,
    clientsUpdatedAt,
    users,
  };
}

async function handleApi(request, env) {
  const auth = await verifyTelegramInitData(request.headers.get("x-telegram-init-data"), env);
  if (!auth.ok) {
    return jsonResponse({ ok: false, error: auth.error }, 401);
  }
  const user = await getAuthorizedUser(env, auth);
  if (!user) {
    return jsonResponse({ ok: false, error: "Bu Mini App uchun dostup yo'q." }, 403);
  }

  const url = new URL(request.url);
  const body = request.method === "GET" ? {} : await readJsonBody(request);

  try {
    if (request.method === "GET" && url.pathname === "/api/state") {
      return jsonResponse({ ok: true, state: await buildState(env, user) });
    }

    if (request.method === "GET" && url.pathname === "/api/clients") {
      return jsonResponse({ ok: true, clients: await getClients(env, url.searchParams.get("force") === "1") });
    }

    if (request.method === "GET" && url.pathname === "/api/cards") {
      return jsonResponse({ ok: true, cards: await getKaitenCards(env) });
    }

    if (request.method === "POST" && url.pathname === "/api/clients") {
      if (!assertRole(user, "editor")) {
        return jsonResponse({ ok: false, error: "Mijoz qo'shish uchun editor dostup kerak." }, 403);
      }
      const client = await appendClient(env, body);
      await audit(env, user, "client.create", { name: client.name });
      return jsonResponse({ ok: true, client, state: await buildState(env, user) });
    }

    if (request.method === "POST" && url.pathname === "/api/cards") {
      if (!assertRole(user, "editor")) {
        return jsonResponse({ ok: false, error: "Card yaratish uchun editor dostup kerak." }, 403);
      }
      let clientName = String(body.clientName || "").trim();
      if (body.newClient) {
        const client = await appendClient(env, body.client || {});
        clientName = client.name;
        await audit(env, user, client.alreadyExists ? "client.exists.before_card" : "client.create.before_card", {
          name: client.name,
          updatedRange: client.updatedRange || null,
        });
      }
      const title = String(body.newClient ? buildCardTitle({ ...body, clientName }) : (body.title || buildCardTitle({ ...body, clientName }))).trim();
      if (!title) {
        return jsonResponse({ ok: false, error: "Card title bo'sh." }, 400);
      }
      const card = await createKaitenCard(env, title, columnConfig(env)[0].id);
      await audit(env, user, "card.create", { cardId: card.id, title });
      return jsonResponse({ ok: true, card, state: await buildState(env, user) });
    }

    const cardUpdateMatch = url.pathname.match(/^\/api\/cards\/(\d+)$/);
    if (request.method === "PATCH" && cardUpdateMatch) {
      if (!assertRole(user, "editor")) {
        return jsonResponse({ ok: false, error: "Card edit uchun editor dostup kerak." }, 403);
      }
      const patch = {};
      if (body.title !== undefined) {
        patch.title = String(body.title || "").trim();
      }
      if (body.columnId !== undefined) {
        const columnId = validColumnId(env, body.columnId);
        if (!columnId) {
          return jsonResponse({ ok: false, error: "Column noto'g'ri." }, 400);
        }
        patch.columnId = columnId;
      }
      const card = await updateKaitenCard(env, cardUpdateMatch[1], patch);
      if (body.comment) {
        await addKaitenComment(env, card.id, body.comment);
      }
      await audit(env, user, "card.update", { cardId: card.id, patch });
      return jsonResponse({ ok: true, card, state: await buildState(env, user) });
    }

    const cardMoveMatch = url.pathname.match(/^\/api\/cards\/(\d+)\/move$/);
    if (request.method === "POST" && cardMoveMatch) {
      if (!assertRole(user, "editor")) {
        return jsonResponse({ ok: false, error: "Card move uchun editor dostup kerak." }, 403);
      }
      const columnId = validColumnId(env, body.columnId);
      if (!columnId) {
        return jsonResponse({ ok: false, error: "Column noto'g'ri." }, 400);
      }
      const card = await updateKaitenCard(env, cardMoveMatch[1], { columnId });
      await audit(env, user, "card.move", { cardId: card.id, columnId });
      return jsonResponse({ ok: true, card, state: await buildState(env, user) });
    }

    if (url.pathname === "/api/admin/users") {
      if (!assertRole(user, "admin")) {
        return jsonResponse({ ok: false, error: "Admin panel uchun admin dostup kerak." }, 403);
      }
      if (request.method === "GET") {
        return jsonResponse({ ok: true, users: await listUsers(env) });
      }
      if (request.method === "POST") {
        const telegramId = String(body.telegramId || "").trim();
        const role = normalizeRole(body.role);
        if (!/^\d+$/.test(telegramId)) {
          return jsonResponse({ ok: false, error: "Telegram ID noto'g'ri." }, 400);
        }
        if (role === "owner") {
          return jsonResponse({ ok: false, error: "Owner role env orqali belgilanadi." }, 400);
        }
        await kvPutJson(env, userKey(telegramId), {
          telegramId,
          role,
          name: String(body.name || "").trim(),
          createdAt: new Date().toISOString(),
          createdBy: user.telegramId,
        });
        await audit(env, user, "user.upsert", { telegramId, role });
        return jsonResponse({ ok: true, users: await listUsers(env) });
      }
    }

    const userMatch = url.pathname.match(/^\/api\/admin\/users\/(\d+)$/);
    if (userMatch) {
      if (!assertRole(user, "admin")) {
        return jsonResponse({ ok: false, error: "Admin panel uchun admin dostup kerak." }, 403);
      }
      if (request.method === "DELETE") {
        if (userMatch[1] === ownerId(env)) {
          return jsonResponse({ ok: false, error: "Owner o'chirilmaydi." }, 400);
        }
        await kvDelete(env, userKey(userMatch[1]));
        await audit(env, user, "user.delete", { telegramId: userMatch[1] });
        return jsonResponse({ ok: true, users: await listUsers(env) });
      }
      if (request.method === "PATCH") {
        const existing = await kvGetJson(env, userKey(userMatch[1]), { telegramId: userMatch[1] });
        await kvPutJson(env, userKey(userMatch[1]), {
          ...existing,
          role: normalizeRole(body.role || existing.role),
          name: String(body.name || existing.name || "").trim(),
          updatedAt: new Date().toISOString(),
          updatedBy: user.telegramId,
        });
        await audit(env, user, "user.update", { telegramId: userMatch[1] });
        return jsonResponse({ ok: true, users: await listUsers(env) });
      }
    }
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message }, 500);
  }

  return jsonResponse({ ok: false, error: "Endpoint topilmadi." }, 404);
}

function appHtml() {
  return htmlResponse(`<!doctype html>
<html lang="uz">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>ISOMEDIA Shooting</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    :root {
      color-scheme: dark;
      --font-base: 14px;
      --bg: #171717;
      --surface: #242424;
      --column: rgba(28,28,28,.9);
      --card: #3f3f3f;
      --line: rgba(255,255,255,.13);
      --muted: rgba(255,255,255,.62);
      --text: #f5f5f5;
      --accent: #8bd3ff;
      --ok: #7ee787;
      --danger: #ff7b72;
      --field: #151515;
      --drop: rgba(139,211,255,.12);
      --active: rgba(139,211,255,.16);
      --radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }
    html[data-theme="light"] {
      color-scheme: light;
      --bg: #f3f5f7;
      --surface: #ffffff;
      --column: rgba(255,255,255,.88);
      --card: #ffffff;
      --line: rgba(15,23,42,.14);
      --muted: rgba(15,23,42,.62);
      --text: #111827;
      --accent: #2563eb;
      --danger: #dc2626;
      --field: #f8fafc;
      --drop: rgba(37,99,235,.08);
      --active: rgba(37,99,235,.12);
    }
    * { box-sizing: border-box; }
    html {
      height: 100%;
      overflow: hidden;
      overscroll-behavior: none;
    }
    body {
      height: 100%;
      margin: 0;
      background: radial-gradient(circle at 55% 55%, rgba(255,255,255,.16), transparent 22rem), var(--bg);
      color: var(--text);
      font-size: var(--font-base);
      letter-spacing: 0;
      overflow: hidden;
      overscroll-behavior: none;
      -webkit-text-size-adjust: 100%;
    }
    html.dragging-card,
    body.dragging-card {
      touch-action: none;
      overscroll-behavior: none;
    }
    button, input, select, textarea {
      font: inherit;
    }
    button {
      min-height: 2.667em;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      padding: .6em .8em;
      font-weight: 650;
      cursor: pointer;
    }
    button.primary { background: #2f81f7; border-color: #2f81f7; }
    button.danger { color: var(--danger); }
    button:disabled { opacity: .55; }
    .shell {
      width: min(1320px, 100%);
      margin: 0 auto;
      height: 100vh;
      height: 100dvh;
      padding: .8em .8em calc(1.467em + env(safe-area-inset-bottom));
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .topbar {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: .8em;
      align-items: center;
      margin-bottom: .8em;
    }
    h1 { margin: 0; font-size: 1.467em; line-height: 1.15; }
    .meta { color: var(--muted); font-size: .867em; margin-top: 4px; }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: .533em;
      justify-content: flex-end;
    }
    .toolbar button {
      white-space: nowrap;
    }
    .board {
      flex: 1 1 auto;
      min-height: 0;
      display: grid;
      grid-template-columns: repeat(3, minmax(18.667em, 1fr));
      gap: .933em;
      align-items: start;
      overflow-x: auto;
      overflow-y: hidden;
      padding-bottom: 10px;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
    }
    .board.drag-lock {
      overflow: hidden;
      touch-action: none;
    }
    .column {
      min-width: 18.667em;
      height: 100%;
      min-height: 0;
      background: var(--column);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: border-color .18s ease, background .18s ease, transform .18s ease;
    }
    .column.drop-target {
      border-color: var(--accent);
      background: var(--drop);
      transform: translateY(-1px);
    }
    .column-head {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: .533em;
      align-items: center;
      padding: .8em;
      border-bottom: 1px solid var(--line);
    }
    .column-title { font-size: 1.2em; font-weight: 750; }
    .badge {
      min-width: 30px;
      padding: .2em .533em;
      border-radius: 7px;
      background: rgba(255,255,255,.2);
      text-align: center;
      font-weight: 750;
    }
    .cards {
      flex: 1 1 auto;
      min-height: 0;
      display: grid;
      align-content: start;
      gap: .667em;
      padding: .667em;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
    }
    .card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      max-width: 100%;
      height: auto;
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: .8em;
      text-align: left;
      min-height: 5.6em;
      line-height: 1.35;
      overflow: hidden;
      box-shadow: 0 10px 24px rgba(0,0,0,.18);
      touch-action: manipulation;
      cursor: pointer;
      user-select: none;
      transition: border-color .16s ease, box-shadow .16s ease, transform .16s ease, opacity .16s ease;
    }
    .card.pressed {
      border-color: var(--accent);
      box-shadow: 0 16px 42px rgba(0,0,0,.32);
      transform: scale(.985);
    }
    .card.dragging {
      opacity: .34;
      touch-action: none;
    }
    .drag-ghost {
      position: fixed;
      z-index: 40;
      width: min(360px, 78vw);
      max-height: 55vh;
      overflow: hidden;
      pointer-events: none;
      transform: translate(-50%, -50%) scale(1.02);
      opacity: .94;
    }
    .card-title {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      word-break: break-word;
      font-size: 1.06em;
      font-weight: 500;
    }
    .card-footer {
      display: flex;
      flex-wrap: wrap;
      gap: .533em;
      margin-top: .8em;
      color: var(--muted);
      font-size: .867em;
    }
    .client-pill {
      display: inline-block;
      max-width: 100%;
      margin-top: .667em;
      padding: .333em .8em;
      border-radius: 999px;
      background: #bff5fb;
      color: #263238;
      line-height: 1.2;
      overflow-wrap: anywhere;
      white-space: normal;
    }
    .modal {
      position: fixed;
      inset: 0;
      display: none;
      place-items: end center;
      padding: 14px;
      background: rgba(0,0,0,.52);
      z-index: 10;
    }
    .modal.open { display: grid; }
    .sheet {
      width: min(720px, 100%);
      max-height: min(860px, 92vh);
      overflow: auto;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: .933em;
      box-shadow: 0 24px 80px rgba(0,0,0,.44);
    }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .667em; }
    .field { display: grid; gap: .333em; }
    .field.full { grid-column: 1 / -1; }
    label { color: var(--muted); font-size: .867em; font-weight: 650; }
    input, select, textarea {
      width: 100%;
      min-height: 2.8em;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--field);
      color: var(--text);
      padding: .6em .667em;
    }
    textarea { min-height: 5.733em; resize: vertical; }
    .client-combobox { position: relative; }
    .client-suggestions {
      position: absolute;
      left: 0;
      right: 0;
      top: calc(100% + .4em);
      z-index: 20;
      display: none;
      max-height: 260px;
      overflow-y: auto;
      border: 1px solid rgba(139,211,255,.35);
      border-radius: var(--radius);
      background: var(--field);
      box-shadow: 0 18px 48px rgba(0,0,0,.42);
    }
    .client-suggestions.open { display: block; }
    .client-suggestion {
      width: 100%;
      min-height: 3.467em;
      border: 0;
      border-bottom: 1px solid var(--line);
      border-radius: 0;
      background: transparent;
      text-align: left;
      font-weight: 600;
    }
    .client-suggestion small {
      display: block;
      margin-top: .2em;
      color: var(--muted);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(8em, 1fr));
      gap: .467em;
    }
    .icon-choice.active { outline: 2px solid var(--accent); }
    .preview {
      padding: .8em;
      border-radius: var(--radius);
      background: rgba(139,211,255,.1);
      border: 1px solid rgba(139,211,255,.25);
      white-space: pre-wrap;
    }
    .admin-panel {
      position: fixed;
      inset: 0;
      display: none;
      z-index: 12;
      padding: 14px;
      background: rgba(0,0,0,.58);
      overflow: auto;
      overscroll-behavior: contain;
    }
    .admin-panel.open { display: block; }
    .admin-card {
      width: min(720px, 100%);
      margin: max(18px, env(safe-area-inset-top)) auto;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: .933em;
      box-shadow: 0 24px 80px rgba(0,0,0,.44);
    }
    .admin-head {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: .667em;
      align-items: center;
      margin-bottom: .8em;
    }
    .admin-head h2 { margin: 0; font-size: 1.333em; }
    .user-row {
      display: grid;
      grid-template-columns: 1fr 120px 80px;
      gap: .533em;
      align-items: center;
      padding: .533em 0;
      border-bottom: 1px solid var(--line);
    }
    .status { margin-top: 10px; color: var(--muted); min-height: 22px; }
    .settings-panel {
      position: fixed;
      inset: 0;
      display: none;
      z-index: 13;
      padding: 14px;
      background: rgba(0,0,0,.58);
      overflow: auto;
      overscroll-behavior: contain;
    }
    .settings-panel.open { display: block; }
    .settings-card {
      width: min(620px, 100%);
      margin: max(18px, env(safe-area-inset-top)) auto;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: .933em;
      box-shadow: 0 24px 80px rgba(0,0,0,.44);
    }
    .settings-head {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: .667em;
      align-items: center;
      margin-bottom: .8em;
    }
    .settings-head h2 { margin: 0; font-size: 1.333em; }
    .segmented {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: .4em;
    }
    .segmented button.active {
      border-color: var(--accent);
      background: var(--active);
    }
    .error { color: var(--danger); }
    .hidden { display: none; }
    @media (max-width: 760px) {
      .topbar { grid-template-columns: 1fr; }
      .toolbar { justify-content: stretch; }
      .toolbar button { flex: 1 1 auto; }
      .board { grid-template-columns: repeat(3, 84vw); scroll-snap-type: x mandatory; }
      .column { scroll-snap-align: start; }
      .form-grid { grid-template-columns: 1fr; }
      .user-row { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div>
        <h1>ISOMEDIA Shooting</h1>
        <div class="meta" id="meta">Yuklanmoqda...</div>
      </div>
      <div class="toolbar">
        <button class="primary" id="newBtn">+ Yangi syomka</button>
        <button id="newClientBtn">+ Yangi mijoz</button>
        <button id="refreshBtn">Yangilash</button>
        <button id="settingsBtn">Ko'rinish</button>
        <button id="adminBtn" class="hidden">Admin</button>
      </div>
    </header>
    <main id="board" class="board"></main>
    <section id="adminPanel" class="admin-panel"></section>
    <section id="settingsPanel" class="settings-panel"></section>
    <div id="status" class="status"></div>
  </div>

  <div id="modal" class="modal" aria-hidden="true">
    <div class="sheet">
      <form id="cardForm" class="form-grid">
        <div class="field full">
          <label>Icon</label>
          <div id="iconGrid" class="icon-grid"></div>
        </div>
        <div class="field">
          <label>Sana</label>
          <input id="dateInput" type="date" required>
        </div>
        <div class="field">
          <label>Boshlanish</label>
          <input id="startTimeInput" type="time" required>
        </div>
        <div class="field">
          <label>Tugash</label>
          <input id="endTimeInput" type="time">
        </div>
        <div class="field full">
          <label>Mijoz</label>
          <div class="client-combobox">
            <input id="clientInput" autocomplete="off" placeholder="Mijoz nomi" required>
            <div id="clientSuggestions" class="client-suggestions"></div>
          </div>
        </div>
        <div class="field full">
          <button type="button" id="refreshClientsBtn">Mijozlar bazasini yangilash</button>
        </div>
        <div class="field full">
          <label>Preview</label>
          <div id="preview" class="preview"></div>
        </div>
        <div class="field full">
          <label>Title edit</label>
          <textarea id="titleInput"></textarea>
        </div>
        <div class="field">
          <label>Column</label>
          <select id="columnInput"></select>
        </div>
        <div class="field">
          <label>Comment</label>
          <input id="commentInput" placeholder="Ixtiyoriy">
        </div>
        <div class="field full">
          <button class="primary" type="submit">Saqlash</button>
          <button type="button" id="closeModal">Yopish</button>
        </div>
      </form>
    </div>
  </div>

  <div id="clientModal" class="modal" aria-hidden="true">
    <div class="sheet">
      <form id="clientForm" class="form-grid">
        <div class="field"><label>Ism</label><input id="firstNameInput" required></div>
        <div class="field"><label>Familiya</label><input id="lastNameInput" required></div>
        <div class="field"><label>Sohasi yoki kompaniyasi</label><input id="companyInput"></div>
        <div class="field"><label>Telefon</label><input id="phoneInput"></div>
        <div class="field full"><label>Izoh</label><textarea id="noteInput"></textarea></div>
        <div class="field full">
          <button class="primary" type="submit">Mijozni saqlash</button>
          <button type="button" id="closeClientModal">Yopish</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    (function () {
      var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
      if (tg) {
        tg.ready();
        tg.expand();
        if (typeof tg.disableVerticalSwipes === "function") {
          tg.disableVerticalSwipes();
        }
      }

      var state = null;
      var selectedIcon = "⭐️";
      var editingCard = null;
      var boardEl = document.getElementById("board");
      var statusEl = document.getElementById("status");
      var metaEl = document.getElementById("meta");
      var modalEl = document.getElementById("modal");
      var clientModalEl = document.getElementById("clientModal");
      var adminPanel = document.getElementById("adminPanel");
      var settingsPanel = document.getElementById("settingsPanel");
      var clientSuggestions = document.getElementById("clientSuggestions");
      var audioContext = null;
      var suppressClickUntil = 0;
      var dragState = null;
      var preferences = {
        theme: "auto"
      };
      var months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
      var monthMap = months.reduce(function (acc, month, index) {
        acc[month.toLowerCase()] = index + 1;
        return acc;
      }, {});

      function escapeText(value) {
        return String(value == null ? "" : value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      }

      function normalizeSearch(value) {
        return String(value == null ? "" : value)
          .toLowerCase()
          .replace(/'/g, "")
          .trim();
      }

      function setStatus(text, error) {
        statusEl.textContent = text || "";
        statusEl.className = error ? "status error" : "status";
      }

      function storageGet(key, fallback) {
        try {
          var value = localStorage.getItem(key);
          return value == null ? fallback : value;
        } catch (_) {
          return fallback;
        }
      }

      function storageSet(key, value) {
        try {
          localStorage.setItem(key, value);
        } catch (_) {
          return null;
        }
      }

      function effectiveTheme(theme) {
        if (theme === "light" || theme === "dark") {
          return theme;
        }
        if (tg && tg.colorScheme === "light") {
          return "light";
        }
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
      }

      function loadPreferences() {
        preferences.theme = storageGet("kaiten:theme", "auto");
      }

      function applyPreferences() {
        var theme = effectiveTheme(preferences.theme);
        document.documentElement.dataset.theme = theme;
      }

      function savePreferences() {
        storageSet("kaiten:theme", preferences.theme);
        applyPreferences();
        renderSettings();
      }

      function haptic(type) {
        try {
          if (tg && tg.HapticFeedback) {
            if (type === "success" && tg.HapticFeedback.notificationOccurred) {
              tg.HapticFeedback.notificationOccurred("success");
            } else if (tg.HapticFeedback.impactOccurred) {
              tg.HapticFeedback.impactOccurred(type || "light");
            }
          }
        } catch (_) {
          return null;
        }
        if (navigator.vibrate) {
          navigator.vibrate(type === "success" ? [18, 28, 18] : 18);
        }
      }

      function playRiser() {
        try {
          var AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          audioContext = audioContext || new AudioCtx();
          if (audioContext.state === "suspended") {
            audioContext.resume();
          }
          var now = audioContext.currentTime;
          var gain = audioContext.createGain();
          var filter = audioContext.createBiquadFilter();
          var oscA = audioContext.createOscillator();
          var oscB = audioContext.createOscillator();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(720, now);
          filter.frequency.exponentialRampToValueAtTime(4200, now + .62);
          gain.gain.setValueAtTime(.0001, now);
          gain.gain.exponentialRampToValueAtTime(.07, now + .08);
          gain.gain.exponentialRampToValueAtTime(.0001, now + .7);
          oscA.type = "sine";
          oscB.type = "triangle";
          oscA.frequency.setValueAtTime(260, now);
          oscA.frequency.exponentialRampToValueAtTime(920, now + .65);
          oscB.frequency.setValueAtTime(392, now);
          oscB.frequency.exponentialRampToValueAtTime(1320, now + .65);
          oscA.connect(filter);
          oscB.connect(filter);
          filter.connect(gain);
          gain.connect(audioContext.destination);
          oscA.start(now);
          oscB.start(now);
          oscA.stop(now + .72);
          oscB.stop(now + .72);
        } catch (_) {
          return null;
        }
      }

      function celebrateNewCard() {
        playRiser();
        haptic("success");
      }

      function monthTitle(dateValue) {
        var parts = String(dateValue || "").split("-").map(Number);
        if (!parts[0] || !parts[1] || !parts[2]) return "";
        return parts[2] + "-" + months[parts[1] - 1];
      }

      function pad2(value) {
        return String(value).padStart(2, "0");
      }

      function parseCardTitle(title) {
        var clean = String(title || "").trim().replace(/\s+/g, " ");
        var match = clean.match(/^([^0-9]*?)(\\d{1,2})-([A-Za-z'’]+)\\s+(\\d{1,2}:\\d{2}(?:\\s*-\\s*\\d{1,2}:\\d{2})?)\\s+(.+)$/u);
        if (!match) {
          return {
            icon: "",
            date: "",
            time: "",
            clientName: guessClient(clean),
          };
        }
        var month = monthMap[String(match[3] || "").toLowerCase().replace(/['’]/g, "")];
        var day = Number(match[2]);
        var year = new Date().getFullYear();
        return {
          icon: String(match[1] || "").trim(),
          date: month ? year + "-" + pad2(month) + "-" + pad2(day) : "",
          time: String(match[4] || "").replace(/\\s*-\\s*/g, "-"),
          clientName: String(match[5] || "").trim(),
        };
      }

      function normalizeTimeInput(value) {
        var match = String(value || "").trim().match(/^(\\d{1,2}):(\\d{2})$/);
        if (!match) return "";
        return pad2(Number(match[1])) + ":" + match[2];
      }

      function splitTimeRange(value) {
        var parts = String(value || "").replace(/\\s+/g, "").replace(/[–—]/g, "-").split("-");
        return {
          start: normalizeTimeInput(parts[0]),
          end: normalizeTimeInput(parts[1])
        };
      }

      function selectedTimeRange() {
        var start = document.getElementById("startTimeInput").value;
        var end = document.getElementById("endTimeInput").value;
        if (start && end) {
          return start + "-" + end;
        }
        return start;
      }

      function buildTitle() {
        var dateText = monthTitle(document.getElementById("dateInput").value);
        var time = selectedTimeRange();
        var client = document.getElementById("clientInput").value.trim();
        return [selectedIcon ? selectedIcon + dateText : dateText, time, client].filter(Boolean).join(" ").trim();
      }

      async function api(path, options) {
        var response = await fetch(path, {
          method: options && options.method ? options.method : "GET",
          headers: {
            "content-type": "application/json",
            "x-telegram-init-data": tg ? tg.initData : ""
          },
          body: options && options.body ? JSON.stringify(options.body) : undefined
        });
        var data = await response.json().catch(function () {
          return { ok: false, error: "Server javobi o'qilmadi." };
        });
        if (!response.ok || !data.ok) {
          throw new Error(data.error || "So'rov bajarilmadi.");
        }
        return data;
      }

      async function refresh() {
        setStatus("Yangilanmoqda...");
        try {
          var data = await api("/api/state");
          state = data.state;
          render();
          if (state.clientsError) {
            setStatus("Mijozlar bazasi o'qilmadi: " + state.clientsError, true);
          } else {
            setStatus("Yangilandi.");
          }
        } catch (error) {
          setStatus(error.message, true);
        }
      }

      function cardsForColumn(columnId) {
        return (state.cards || []).filter(function (card) {
          return Number(card.columnId) === Number(columnId);
        });
      }

      function guessClient(title) {
        var matched = (state.clients || []).find(function (client) {
          return client.name && title.toLowerCase().includes(client.name.toLowerCase());
        });
        return matched ? matched.name : "";
      }

      function render() {
        var clientMeta = state.clientsError
          ? " · mijoz bazasi xato"
          : " · " + (state.clients || []).length + " mijoz";
        metaEl.textContent = state.user.name + " / " + state.user.role + clientMeta;
        document.getElementById("adminBtn").classList.toggle("hidden", !["owner", "admin"].includes(state.user.role));
        document.getElementById("columnInput").innerHTML = state.config.columns
          .map(function (column) { return '<option value="' + column.id + '">' + escapeText(column.title) + '</option>'; })
          .join("");
        boardEl.innerHTML = state.config.columns.map(function (column) {
          var cards = cardsForColumn(column.id);
          return '<section class="column" data-column-id="' + column.id + '">' +
            '<div class="column-head"><div class="column-title">' + escapeText(column.title) + '</div><div class="badge">' + cards.length + '</div></div>' +
            '<div class="cards">' + cards.map(renderCard).join("") + '</div>' +
          '</section>';
        }).join("");
        renderIconGrid();
        renderAdmin();
        renderClientSuggestions();
        if (state.clientsError) {
          setStatus("Mijozlar bazasi o'qilmadi: " + state.clientsError, true);
        }
      }

      function renderCard(card) {
        var client = guessClient(card.title);
        return '<article class="card" role="button" tabindex="0" data-card-id="' + card.id + '">' +
          '<div class="card-title">' + escapeText(card.title) + '</div>' +
          (client ? '<span class="client-pill">' + escapeText(client) + '</span>' : '') +
          '<div class="card-footer"><span>#' + card.id + '</span><span>💬 ' + Number(card.commentsTotal || 0) + '</span></div>' +
        '</article>';
      }

      function findCardById(cardId) {
        return (state.cards || []).find(function (item) {
          return String(item.id) === String(cardId);
        });
      }

      function clearDropTargets() {
        document.querySelectorAll(".column.drop-target").forEach(function (column) {
          column.classList.remove("drop-target");
        });
      }

      function columnAtPoint(x, y) {
        var element = document.elementFromPoint(x, y);
        return element ? element.closest("[data-column-id]") : null;
      }

      function updateDragGhost(x, y) {
        if (!dragState || !dragState.ghost) return;
        dragState.ghost.style.left = x + "px";
        dragState.ghost.style.top = y + "px";
        if (dragState.boardScrollLeft != null) {
          boardEl.scrollLeft = dragState.boardScrollLeft;
        }
        if (dragState.boardScrollTop != null) {
          boardEl.scrollTop = dragState.boardScrollTop;
        }
        clearDropTargets();
        var column = columnAtPoint(x, y);
        if (column) {
          column.classList.add("drop-target");
          dragState.targetColumnId = Number(column.getAttribute("data-column-id"));
        } else {
          dragState.targetColumnId = null;
        }
      }

      function beginDrag() {
        if (!dragState || dragState.active) return;
        dragState.active = true;
        suppressClickUntil = Date.now() + 900;
        dragState.boardScrollLeft = boardEl.scrollLeft;
        dragState.boardScrollTop = boardEl.scrollTop;
        document.documentElement.classList.add("dragging-card");
        document.body.classList.add("dragging-card");
        boardEl.classList.add("drag-lock");
        try {
          dragState.cardButton.setPointerCapture(dragState.pointerId);
        } catch (_) {}
        dragState.cardButton.classList.add("dragging");
        dragState.ghost = dragState.cardButton.cloneNode(true);
        dragState.ghost.classList.add("drag-ghost");
        dragState.ghost.classList.remove("pressed");
        dragState.ghost.removeAttribute("data-card-id");
        document.body.appendChild(dragState.ghost);
        haptic("medium");
        updateDragGhost(dragState.lastX, dragState.lastY);
        setStatus("Cardni kerakli column ustiga olib borib qo'ying.");
      }

      function cleanupDrag() {
        if (!dragState) return;
        var active = dragState.active;
        var scrollLeft = dragState.boardScrollLeft;
        var scrollTop = dragState.boardScrollTop;
        clearTimeout(dragState.timer);
        clearDropTargets();
        if (dragState.ghost) {
          dragState.ghost.remove();
        }
        if (dragState.cardButton) {
          try {
            dragState.cardButton.releasePointerCapture(dragState.pointerId);
          } catch (_) {}
          dragState.cardButton.classList.remove("pressed", "dragging");
        }
        if (active) {
          document.documentElement.classList.remove("dragging-card");
          document.body.classList.remove("dragging-card");
          boardEl.classList.remove("drag-lock");
          if (scrollLeft != null) {
            boardEl.scrollLeft = scrollLeft;
          }
          if (scrollTop != null) {
            boardEl.scrollTop = scrollTop;
          }
        }
        window.removeEventListener("pointermove", onDragPointerMove);
        window.removeEventListener("pointerup", onDragPointerUp);
        window.removeEventListener("pointercancel", onDragPointerCancel);
        dragState = null;
      }

      function onDragPointerMove(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        dragState.lastX = event.clientX;
        dragState.lastY = event.clientY;
        var distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
        if (!dragState.active && distance > 13) {
          cleanupDrag();
          return;
        }
        if (dragState.active) {
          event.preventDefault();
          updateDragGhost(event.clientX, event.clientY);
        }
      }

      async function onDragPointerUp(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        var active = dragState.active;
        var card = dragState.card;
        var targetColumnId = dragState.targetColumnId;
        var sourceColumnId = Number(card.columnId);
        cleanupDrag();
        if (!active) return;
        suppressClickUntil = Date.now() + 900;
        if (!targetColumnId || targetColumnId === sourceColumnId) {
          setStatus("Card joyi o'zgarmadi.");
          return;
        }
        setStatus("Card ko'chirilmoqda...");
        try {
          var data = await api("/api/cards/" + card.id + "/move", {
            method: "POST",
            body: { columnId: targetColumnId }
          });
          state = data.state;
          render();
          haptic("success");
          setStatus("Card boshqa column'ga o'tkazildi.");
        } catch (error) {
          setStatus(error.message, true);
        }
      }

      function onDragPointerCancel() {
        cleanupDrag();
      }

      function armCardDrag(event) {
        var cardButton = event.target.closest("[data-card-id]");
        if (!cardButton || !state) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if (dragState) {
          cleanupDrag();
        }
        var card = findCardById(cardButton.getAttribute("data-card-id"));
        if (!card) return;
        dragState = {
          active: false,
          timer: null,
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          lastX: event.clientX,
          lastY: event.clientY,
          cardButton: cardButton,
          card: card,
          targetColumnId: Number(card.columnId),
          ghost: null
        };
        cardButton.classList.add("pressed");
        dragState.timer = setTimeout(beginDrag, 420);
        window.addEventListener("pointermove", onDragPointerMove, { passive: false });
        window.addEventListener("pointerup", onDragPointerUp);
        window.addEventListener("pointercancel", onDragPointerCancel);
      }

      function renderIconGrid() {
        document.getElementById("iconGrid").innerHTML = state.config.iconPresets.map(function (preset) {
          return '<button type="button" class="icon-choice ' + (preset.value === selectedIcon ? "active" : "") + '" data-icon="' + escapeText(preset.value) + '">' +
            escapeText(preset.value + " " + preset.label) +
          '</button>';
        }).join("");
      }

      function renderAdmin() {
        if (!["owner", "admin"].includes(state.user.role)) return;
        adminPanel.innerHTML =
          '<div class="admin-card">' +
            '<div class="admin-head"><h2>Admin whitelist</h2><button id="closeAdminBtn" type="button">Yopish</button></div>' +
            '<div class="form-grid">' +
              '<input id="adminUserId" inputmode="numeric" placeholder="Telegram ID">' +
              '<input id="adminUserName" placeholder="Ism">' +
              '<select id="adminUserRole"><option value="editor">editor</option><option value="viewer">viewer</option><option value="admin">admin</option></select>' +
              '<button id="addUserBtn" type="button" class="primary">Qo&#39;shish</button>' +
            '</div>' +
            '<div>' + (state.users || []).map(function (user) {
              return '<div class="user-row"><span>' + escapeText(user.telegramId + " / " + (user.name || "")) + '</span><strong>' + escapeText(user.role) + '</strong>' +
                (user.role === "owner" ? '<span>env</span>' : '<button type="button" data-delete-user="' + escapeText(user.telegramId) + '">O&#39;chirish</button>') +
              '</div>';
            }).join("") + '</div>' +
          '</div>';
      }

      function renderSettings() {
        settingsPanel.innerHTML =
          '<div class="settings-card">' +
            '<div class="settings-head"><h2>Ko&#39;rinish</h2><button id="closeSettingsBtn" type="button">Yopish</button></div>' +
            '<div class="field full">' +
              '<label>Theme</label>' +
              '<div class="segmented">' +
                '<button type="button" data-theme-choice="auto" class="' + (preferences.theme === "auto" ? "active" : "") + '">Auto</button>' +
                '<button type="button" data-theme-choice="dark" class="' + (preferences.theme === "dark" ? "active" : "") + '">Dark</button>' +
                '<button type="button" data-theme-choice="light" class="' + (preferences.theme === "light" ? "active" : "") + '">White</button>' +
              '</div>' +
            '</div>' +
          '</div>';
      }

      function renderClientSuggestions() {
        if (!state || !clientSuggestions) return;
        var input = document.getElementById("clientInput");
        var query = normalizeSearch(input.value);
        if (query.length < 2) {
          clientSuggestions.classList.remove("open");
          clientSuggestions.innerHTML = "";
          return;
        }
        var matches = (state.clients || []).filter(function (client) {
          return normalizeSearch([client.name, client.company, client.phone].filter(Boolean).join(" ")).includes(query);
        }).slice(0, 10);
        if (!matches.length) {
          clientSuggestions.innerHTML = '<button type="button" class="client-suggestion" disabled>Mos mijoz topilmadi</button>';
          clientSuggestions.classList.add("open");
          return;
        }
        clientSuggestions.innerHTML = matches.map(function (client) {
          var detail = [client.company, client.phone].filter(Boolean).join(" / ");
          return '<button type="button" class="client-suggestion" data-client-name="' + escapeText(client.name) + '">' +
            escapeText(client.name) +
            (detail ? '<small>' + escapeText(detail) + '</small>' : '') +
            '</button>';
        }).join("");
        clientSuggestions.classList.add("open");
      }

      function openModal(card) {
        editingCard = card || null;
        if (editingCard) {
          var parsed = parseCardTitle(editingCard.title);
          var parsedTime = splitTimeRange(parsed.time);
          selectedIcon = parsed.icon || selectedIcon;
          document.getElementById("titleInput").value = editingCard.title;
          document.getElementById("clientInput").value = parsed.clientName || guessClient(editingCard.title);
          document.getElementById("columnInput").value = editingCard.columnId;
          document.getElementById("dateInput").value = parsed.date;
          document.getElementById("startTimeInput").value = parsedTime.start;
          document.getElementById("endTimeInput").value = parsedTime.end;
          document.getElementById("dateInput").required = false;
          document.getElementById("startTimeInput").required = false;
          document.getElementById("clientInput").required = false;
        } else {
          document.getElementById("cardForm").reset();
          selectedIcon = "⭐️";
          document.getElementById("dateInput").value = new Date().toISOString().slice(0, 10);
          document.getElementById("columnInput").value = state.config.columns[0].id;
          document.getElementById("titleInput").value = "";
          document.getElementById("dateInput").required = true;
          document.getElementById("startTimeInput").required = true;
          document.getElementById("clientInput").required = true;
        }
        document.getElementById("commentInput").value = "";
        updatePreview();
        modalEl.classList.add("open");
      }

      function closeModal() {
        modalEl.classList.remove("open");
        clientSuggestions.classList.remove("open");
      }

      function openClientModal() {
        document.getElementById("clientForm").reset();
        clientModalEl.classList.add("open");
      }

      function closeClientModal() {
        clientModalEl.classList.remove("open");
      }

      function updatePreview() {
        var title = editingCard && document.getElementById("titleInput").value
          ? document.getElementById("titleInput").value
          : buildTitle();
        document.getElementById("preview").textContent = title || "Preview";
        if (!editingCard) {
          document.getElementById("titleInput").value = title;
        }
      }

      async function saveCard(event) {
        event.preventDefault();
        var wasNewCard = !editingCard;
        var title = document.getElementById("titleInput").value.trim() || buildTitle();
        var columnId = Number(document.getElementById("columnInput").value);
        var comment = document.getElementById("commentInput").value.trim();
        var clientName = document.getElementById("clientInput").value.trim();
        try {
          var payload = {
            title: title,
            columnId: columnId,
            icon: selectedIcon,
            date: document.getElementById("dateInput").value,
            startTime: document.getElementById("startTimeInput").value,
            endTime: document.getElementById("endTimeInput").value,
            time: selectedTimeRange(),
            clientName: clientName,
            comment: comment
          };
          var data = editingCard
            ? await api("/api/cards/" + editingCard.id, { method: "PATCH", body: payload })
            : await api("/api/cards", { method: "POST", body: payload });
          state = data.state;
          render();
          closeModal();
          if (wasNewCard) {
            celebrateNewCard();
          }
          setStatus("Saqlandi.");
        } catch (error) {
          setStatus(error.message, true);
        }
      }

      async function saveClient(event) {
        event.preventDefault();
        var fullName = [
          document.getElementById("firstNameInput").value,
          document.getElementById("lastNameInput").value
        ].map(function (part) {
          return String(part || "").trim();
        }).filter(Boolean).join(" ");
        try {
          var data = await api("/api/clients", {
            method: "POST",
            body: {
              name: fullName,
              company: document.getElementById("companyInput").value,
              phone: document.getElementById("phoneInput").value,
              note: document.getElementById("noteInput").value
            }
          });
          state = data.state;
          render();
          closeClientModal();
          haptic("success");
          setStatus("Mijoz bazaga qo'shildi. Yangi syomkada tanlash mumkin.");
        } catch (error) {
          setStatus(error.message, true);
        }
      }

      document.getElementById("newBtn").addEventListener("click", function () { openModal(null); });
      document.getElementById("newClientBtn").addEventListener("click", openClientModal);
      document.getElementById("refreshBtn").addEventListener("click", refresh);
      document.getElementById("settingsBtn").addEventListener("click", function () {
        renderSettings();
        settingsPanel.classList.add("open");
      });
      document.getElementById("adminBtn").addEventListener("click", function () {
        renderAdmin();
        adminPanel.classList.add("open");
      });
      document.getElementById("closeModal").addEventListener("click", closeModal);
      document.getElementById("closeClientModal").addEventListener("click", closeClientModal);
      document.getElementById("cardForm").addEventListener("submit", saveCard);
      document.getElementById("clientForm").addEventListener("submit", saveClient);
      document.getElementById("refreshClientsBtn").addEventListener("click", async function () {
        setStatus("Mijozlar bazasi yangilanmoqda...");
        try {
          var data = await api("/api/clients?force=1");
          state.clients = data.clients || [];
          state.clientsError = null;
          renderClientSuggestions();
          updatePreview();
          setStatus("Mijozlar bazasi yangilandi: " + state.clients.length + " ta mijoz.");
        } catch (error) {
          setStatus(error.message, true);
        }
      });
      ["dateInput", "startTimeInput", "endTimeInput"].forEach(function (id) {
        document.getElementById(id).addEventListener("input", updatePreview);
      });
      document.getElementById("clientInput").addEventListener("input", function () {
        updatePreview();
        renderClientSuggestions();
      });
      document.getElementById("clientInput").addEventListener("focus", renderClientSuggestions);
      document.getElementById("clientInput").addEventListener("blur", function () {
        setTimeout(function () { clientSuggestions.classList.remove("open"); }, 180);
      });
      clientSuggestions.addEventListener("click", function (event) {
        var button = event.target.closest("[data-client-name]");
        if (!button) return;
        document.getElementById("clientInput").value = button.getAttribute("data-client-name");
        clientSuggestions.classList.remove("open");
        updatePreview();
      });
      document.getElementById("iconGrid").addEventListener("click", function (event) {
        var button = event.target.closest("[data-icon]");
        if (!button) return;
        selectedIcon = button.getAttribute("data-icon");
        renderIconGrid();
        updatePreview();
      });
      boardEl.addEventListener("pointerdown", armCardDrag);
      boardEl.addEventListener("click", function (event) {
        if (Date.now() < suppressClickUntil) {
          event.preventDefault();
          return;
        }
        var cardButton = event.target.closest("[data-card-id]");
        if (!cardButton || !state) return;
        var card = state.cards.find(function (item) { return String(item.id) === cardButton.getAttribute("data-card-id"); });
        if (card) openModal(card);
      });
      settingsPanel.addEventListener("click", function (event) {
        if (event.target === settingsPanel || event.target.id === "closeSettingsBtn") {
          settingsPanel.classList.remove("open");
          return;
        }
        var themeButton = event.target.closest("[data-theme-choice]");
        if (themeButton) {
          preferences.theme = themeButton.getAttribute("data-theme-choice");
          savePreferences();
          haptic("light");
        }
      });
      adminPanel.addEventListener("click", async function (event) {
        if (event.target === adminPanel || event.target.id === "closeAdminBtn") {
          adminPanel.classList.remove("open");
          return;
        }
        if (event.target.id === "addUserBtn") {
          try {
            var data = await api("/api/admin/users", {
              method: "POST",
              body: {
                telegramId: document.getElementById("adminUserId").value,
                name: document.getElementById("adminUserName").value,
                role: document.getElementById("adminUserRole").value
              }
            });
            state.users = data.users;
            renderAdmin();
            setStatus("User whitelistga qo'shildi.");
          } catch (error) {
            setStatus(error.message, true);
          }
        }
        var deleteButton = event.target.closest("[data-delete-user]");
        if (deleteButton) {
          try {
            var deleted = await api("/api/admin/users/" + deleteButton.getAttribute("data-delete-user"), { method: "DELETE" });
            state.users = deleted.users;
            renderAdmin();
            setStatus("User whitelistdan o'chirildi.");
          } catch (error) {
            setStatus(error.message, true);
          }
        }
      });

      loadPreferences();
      applyPreferences();
      renderSettings();
      if (window.matchMedia) {
        try {
          window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function () {
            if (preferences.theme === "auto") {
              applyPreferences();
            }
          });
        } catch (_) {}
      }
      if (tg && tg.onEvent) {
        try {
          tg.onEvent("themeChanged", function () {
            if (preferences.theme === "auto") {
              applyPreferences();
            }
          });
        } catch (_) {}
      }
      refresh();
      setInterval(refresh, 20000);
    }());
  </script>
</body>
</html>`);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && ["/", "/app", "/index.html"].includes(url.pathname)) {
      return appHtml();
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return jsonResponse({
        ok: true,
        version: APP_VERSION,
        appRoutes: ["/", "/app", "/index.html"],
        hasKv: Boolean(env.KAITEN_STATE),
        hasTelegramToken: Boolean(env.TELEGRAM_BOT_TOKEN),
        hasKaitenToken: Boolean(env.KAITEN_API_TOKEN),
        hasGoogleServiceAccount: Boolean(env.GOOGLE_SERVICE_ACCOUNT_JSON),
      });
    }

    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env);
    }

    if (request.method === "POST") {
      const update = await request.json().catch(() => ({}));
      const message = update.message;
      const command = String(message?.text || "").trim().split(/\s+/)[0].split("@")[0];
      if (message?.chat?.id && ["/start", "/app", "/menu"].includes(command)) {
        await setTelegramMenuButton(env, request.url);
        await sendTelegram(
          env,
          message.chat.id,
          "ISOMEDIA Mini App tayyor. Pastdagi tugma yoki xabar yozish joyidagi menu orqali oching.",
          startKeyboard(env, request.url)
        );
      }
      return new Response("OK");
    }

    return new Response("Kaiten Mini App bot is running. Open /app in Telegram.");
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(getClients(env, true).catch(() => null));
  },
};
