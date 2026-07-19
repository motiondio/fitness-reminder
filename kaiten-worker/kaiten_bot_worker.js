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

const APP_VERSION = "kaiten-miniapp-2026-07-19-18";

const ICON_GROUPS = [
  {
    key: "main",
    title: "Asosiy ishlar",
    items: [
      { id: "main-shooting", value: "⭐️", label: "Syomka" },
      { id: "main-edit", value: "✂️", label: "Montaj" },
    ],
  },
  {
    key: "direction",
    title: "Yo'nalish",
    items: [
      { id: "direction-reels", value: "🟢", label: "Reels" },
      { id: "direction-podcast", value: "🔴", label: "Podcast" },
      { id: "direction-youtube", value: "🟡", label: "YouTube" },
      { id: "direction-studio", value: "⭐️", label: "Studio ijarasi" },
      { id: "direction-photo", value: "📷", label: "Fotosessiya" },
      { id: "direction-webinar", value: "💻", label: "Vebinar" },
      { id: "direction-seminar", value: "🏛️", label: "Seminar" },
    ],
  },
  {
    key: "modifier",
    title: "Modifierlar",
    items: [
      { id: "modifier-away", value: "🚚", label: "Vyezdnoy" },
      { id: "modifier-recommendation", value: "🧤", label: "Rekomendatsiya" },
      { id: "modifier-target", value: "🎯", label: "Target" },
      { id: "modifier-hook", value: "🧲", label: "CTA & Hook" },
      { id: "modifier-update", value: "🔺", label: "Eski zakaz update" },
      { id: "modifier-missed", value: "➕", label: "Qolib ketgan card" },
    ],
  },
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
const CARD_DETAIL_CACHE_TTL_SECONDS = 60;

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
    sortOrder: Number(card.sort_order ?? card.position ?? 0),
    tags: normalizeKaitenTags(card.tags || card.card_tags || []),
    state: card.state,
    commentsTotal: card.comments_total || 0,
    updated: card.updated,
    created: card.created,
    url: `https://isoomedia.kaiten.ru/card/${card.id}`,
  };
}

function normalizeKaitenTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }
  const seen = new Set();
  return tags
    .map((tag) => {
      const name = String(
        typeof tag === "string"
          ? tag
          : tag?.name || tag?.title || tag?.text || ""
      ).trim();
      if (!name) {
        return null;
      }
      const key = name.toLowerCase();
      if (seen.has(key)) {
        return null;
      }
      seen.add(key);
      return {
        id: tag?.id || name,
        name,
        color: String(tag?.color || tag?.color_id || tag?.background_color || "").trim(),
      };
    })
    .filter(Boolean);
}

function cardDetailCacheKey(card) {
  return `kaiten:card-detail:${card.id}:${card.updated || "latest"}`;
}

async function fetchKaitenCardDetail(env, card) {
  if ((card.tags || []).length) {
    return card;
  }
  const cacheKey = cardDetailCacheKey(card);
  const cached = await kvGetJson(env, cacheKey);
  if (cached && Array.isArray(cached.tags)) {
    return { ...card, tags: cached.tags };
  }

  try {
    const detail = await kaitenRequest(env, `/cards/${Number(card.id)}`);
    const tags = normalizeKaitenTags(detail?.tags || detail?.card_tags || []);
    await kvPutJson(env, cacheKey, { tags }, CARD_DETAIL_CACHE_TTL_SECONDS);
    return { ...card, tags };
  } catch (_) {
    return { ...card, tags: [] };
  }
}

async function enrichKaitenCards(env, cards) {
  const enriched = [];
  const chunkSize = 8;
  for (let index = 0; index < cards.length; index += chunkSize) {
    const chunk = cards.slice(index, index + chunkSize);
    enriched.push(...await Promise.all(chunk.map((card) => fetchKaitenCardDetail(env, card))));
  }
  return enriched;
}

async function getKaitenCards(env) {
  const columns = columnConfig(env);
  const columnOrder = new Map(columns.map((column, index) => [column.id, index]));
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
  const cards = rawCards
    .filter((card) => columns.some((column) => column.id === Number(card.column_id)))
    .map(normalizeKaitenCard)
    .sort((left, right) => {
      const leftColumn = columnOrder.get(Number(left.columnId)) ?? Number.MAX_SAFE_INTEGER;
      const rightColumn = columnOrder.get(Number(right.columnId)) ?? Number.MAX_SAFE_INTEGER;
      if (leftColumn !== rightColumn) {
        return leftColumn - rightColumn;
      }
      const orderDiff = Number(left.sortOrder || 0) - Number(right.sortOrder || 0);
      if (orderDiff !== 0) {
        return orderDiff;
      }
      return Number(left.id || 0) - Number(right.id || 0);
    });
  return enrichKaitenCards(env, cards);
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
  if (patch.prevCardId !== undefined) {
    if (patch.prevCardId) {
      body.prev_card_id = Number(patch.prevCardId);
    } else {
      body.sort_order = 1;
    }
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

function a1SheetName(env) {
  return `'${String(sheetName(env)).replace(/'/g, "''")}'`;
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

async function getClientRows(env) {
  const range = encodeURIComponent(`${a1SheetName(env)}!A${CONFIG.clientStartRow}:X${CONFIG.clientEndRow}`);
  const data = await googleSheetsRequest(env, `/values/${range}`);
  return Array.isArray(data.values) ? data.values : [];
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
  const rows = await getClientRows(env);
  const clients = rows
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
  const rows = await getClientRows(env);
  const existingClients = rows
    .map(normalizeClient)
    .filter((item) => item.name);
  const existingClient = existingClients.find((item) => normalizeClientName(item.name) === normalizeClientName(fullName));
  if (existingClient) {
    await primeClientCache(env, existingClient);
    return {
      ...existingClient,
      alreadyExists: true,
      updatedRange: null,
      source: "google_sheets_existing",
    };
  }
  let targetRow = null;
  for (let index = 0; index < CONFIG.clientEndRow - CONFIG.clientStartRow + 1; index += 1) {
    const row = rows[index] || [];
    if (!String(row[0] || "").trim()) {
      targetRow = CONFIG.clientStartRow + index;
      break;
    }
  }
  if (!targetRow) {
    throw new Error(`MIJOZLAR BAZASI!A${CONFIG.clientStartRow}:A${CONFIG.clientEndRow} oralig'ida bo'sh qator topilmadi.`);
  }

  const company = String(client.company || "").trim();
  const phone = String(client.phone || "").trim();
  const note = String(client.note || "").trim();
  const sheet = a1SheetName(env);
  const data = await googleSheetsRequest(env, "/values:batchUpdate", {
    method: "POST",
    body: JSON.stringify({
      valueInputOption: "USER_ENTERED",
      data: [
        { range: `${sheet}!A${targetRow}`, values: [[fullName]] },
        { range: `${sheet}!V${targetRow}`, values: [[company]] },
        { range: `${sheet}!W${targetRow}`, values: [[phone]] },
        { range: `${sheet}!X${targetRow}`, values: [[note]] },
      ],
    }),
  });
  const updatedRange = data.responses?.[0]?.updatedRange || `${sheet}!A${targetRow}:X${targetRow}`;
  if (!data.totalUpdatedCells && !data.responses?.length) {
    throw new Error("Google Sheets yozuvni tasdiqlamadi. KV cache yangilanmadi.");
  }
  const createdClient = {
    row: targetRow,
    name: fullName,
    company,
    phone,
    note,
    updatedRange,
    source: "google_sheets",
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
      iconGroups: ICON_GROUPS,
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
      const patch = { columnId };
      if (body.prevCardId !== undefined) {
        const prevCardId = body.prevCardId === null || body.prevCardId === "" ? null : Number(body.prevCardId);
        if (prevCardId !== null && !Number.isFinite(prevCardId)) {
          return jsonResponse({ ok: false, error: "Prev card noto'g'ri." }, 400);
        }
        patch.prevCardId = prevCardId;
      }
      const card = await updateKaitenCard(env, cardMoveMatch[1], patch);
      await audit(env, user, "card.move", { cardId: card.id, columnId, prevCardId: patch.prevCardId ?? null });
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
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
  <title>ISOMEDIA Shooting</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    :root {
      color-scheme: dark;
      --font-base: 13px;
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
      min-height: 2.5em;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      padding: .533em .7em;
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
      padding: .667em .667em calc(1.2em + env(safe-area-inset-bottom));
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .topbar {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: .667em;
      align-items: center;
      margin-bottom: .667em;
    }
    h1 { margin: 0; font-size: 1.467em; line-height: 1.15; }
    .meta { color: var(--muted); font-size: .867em; margin-top: 4px; }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: .467em;
      justify-content: flex-end;
    }
    .toolbar button {
      white-space: nowrap;
    }
    .board {
      flex: 1 1 auto;
      min-height: 0;
      display: grid;
      grid-template-columns: repeat(3, minmax(17.6em, 1fr));
      gap: .733em;
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
      min-width: 17.6em;
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
    .cards.drop-end {
      box-shadow: inset 0 -3px 0 var(--accent);
    }
    .column-head {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: .467em;
      align-items: center;
      padding: .667em;
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
      grid-auto-rows: max-content;
      align-content: start;
      gap: .533em;
      padding: .533em;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
    }
    .card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: .5em;
      width: 100%;
      max-width: 100%;
      height: auto;
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: .667em;
      text-align: left;
      min-height: 0;
      line-height: 1.35;
      overflow: visible;
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
    .card.drop-before {
      box-shadow: inset 0 3px 0 var(--accent), 0 10px 24px rgba(0,0,0,.18);
      border-color: rgba(139,211,255,.75);
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
      display: block;
      width: 100%;
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
      width: 100%;
      margin-top: 0;
      color: var(--muted);
      font-size: .867em;
    }
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: .4em;
      width: 100%;
      max-width: 100%;
    }
    .staff-pill {
      display: inline-block;
      min-width: 0;
      max-width: 100%;
      padding: .333em .8em;
      border-radius: 999px;
      background: #bff5fb;
      color: #263238;
      line-height: 1.2;
      overflow-wrap: anywhere;
      word-break: break-word;
      white-space: normal;
    }
    .staff-pill.c2 { background: #d8c7ff; }
    .staff-pill.c3 { background: #bfe1ff; }
    .staff-pill.c4 { background: #ffe1ad; }
    .staff-pill.c5 { background: #d8f8c4; }
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
      padding: .8em;
      box-shadow: 0 24px 80px rgba(0,0,0,.44);
    }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .667em; }
    .field { display: grid; gap: .333em; }
    .field.full { grid-column: 1 / -1; }
    .sticky-preview {
      position: sticky;
      top: 0;
      z-index: 5;
      margin: -.133em -.133em .133em;
      padding: .133em .133em .533em;
      background: linear-gradient(to bottom, var(--surface) 78%, rgba(0,0,0,0));
    }
    label { color: var(--muted); font-size: .867em; font-weight: 650; }
    input, select, textarea {
      width: 100%;
      min-height: 2.667em;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--field);
      color: var(--text);
      padding: .533em .6em;
    }
    .time-trigger {
      cursor: pointer;
      caret-color: transparent;
    }
    textarea { min-height: 5.733em; resize: vertical; }
    @supports (-webkit-touch-callout: none) {
      input, select, textarea {
        font-size: 16px;
      }
    }
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
      gap: .667em;
    }
    .icon-selection {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: .533em;
      align-items: center;
      padding: .667em .8em;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--field);
    }
    .icon-preview {
      min-width: 0;
      font-size: 1.2em;
      font-weight: 750;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .icon-count {
      color: var(--muted);
      font-weight: 650;
    }
    .icon-group {
      display: grid;
      gap: .4em;
    }
    .icon-group-title {
      color: var(--muted);
      font-size: .867em;
      font-weight: 700;
    }
    .icon-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(8.8em, 1fr));
      gap: .467em;
    }
    .icon-choice {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: .467em;
      align-items: center;
      min-height: 3.067em;
      text-align: left;
      line-height: 1.15;
    }
    .icon-choice.active {
      border-color: var(--accent);
      background: var(--active);
      outline: 2px solid rgba(139,211,255,.25);
    }
    .icon-choice[disabled] {
      opacity: .45;
    }
    .icon-emoji {
      font-size: 1.25em;
      line-height: 1;
    }
    .time-modal {
      position: fixed;
      inset: 0;
      z-index: 16;
      display: none;
      align-items: end;
      justify-content: center;
      padding: 12px;
      background: rgba(0,0,0,.62);
    }
    .time-modal.open { display: flex; }
    .time-sheet {
      width: min(480px, 100%);
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: .8em;
      box-shadow: 0 24px 80px rgba(0,0,0,.5);
    }
    .time-head {
      display: grid;
      grid-template-columns: 3em 1fr 3em;
      gap: .533em;
      align-items: center;
      margin-bottom: .667em;
    }
    .time-head strong {
      text-align: center;
      font-size: 1.067em;
    }
    .time-close,
    .time-apply {
      width: 3em;
      height: 3em;
      min-height: 3em;
      padding: 0;
      border-radius: 999px;
      font-size: 1.2em;
    }
    .time-apply {
      border-color: #ff9f0a;
      background: #ff9f0a;
      color: #fff;
    }
    .wheel-picker {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1em;
      height: 13.8em;
      overflow: hidden;
      -webkit-mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
      mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
    }
    .wheel-highlight {
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 2.667em;
      transform: translateY(-50%);
      border-radius: 999px;
      background: rgba(255,255,255,.08);
      pointer-events: none;
    }
    html[data-theme="light"] .wheel-highlight {
      background: rgba(15,23,42,.08);
    }
    .wheel-column {
      position: relative;
      z-index: 1;
      height: 100%;
      overflow-y: auto;
      padding: 5.6em 0;
      overscroll-behavior: contain;
      scroll-snap-type: y mandatory;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .wheel-column::-webkit-scrollbar { display: none; }
    .wheel-option {
      width: 100%;
      min-height: 2.667em;
      border: 0;
      border-radius: 0;
      background: transparent;
      scroll-snap-align: center;
      color: var(--muted);
      font-size: 1.6em;
      font-weight: 650;
      text-align: center;
      transition: color .12s ease, transform .12s ease;
    }
    .wheel-option.active {
      color: var(--text);
      transform: scale(1.06);
    }
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
      .board { grid-template-columns: repeat(3, 80vw); scroll-snap-type: x mandatory; }
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
        <div class="field full sticky-preview">
          <label>Preview</label>
          <div id="preview" class="preview"></div>
        </div>
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
          <input id="startTimeInput" class="time-trigger" type="text" inputmode="none" autocomplete="off" readonly required placeholder="Boshlanish">
        </div>
        <div class="field">
          <label>Tugash</label>
          <input id="endTimeInput" class="time-trigger" type="text" inputmode="none" autocomplete="off" readonly placeholder="Tugash">
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

  <div id="timeModal" class="time-modal" aria-hidden="true">
    <div class="time-sheet">
      <div class="time-head">
        <button type="button" id="closeTimeModal" class="time-close">×</button>
        <strong id="timeModalTitle">Boshlanish</strong>
        <button type="button" id="applyTimeModal" class="time-apply">✓</button>
      </div>
      <div class="wheel-picker">
        <div class="wheel-highlight"></div>
        <div id="hourWheel" class="wheel-column" aria-label="Soat"></div>
        <div id="minuteWheel" class="wheel-column" aria-label="Daqiqa"></div>
      </div>
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
      var selectedIconIds = ["main-shooting"];
      var editingCard = null;
      var boardEl = document.getElementById("board");
      var statusEl = document.getElementById("status");
      var metaEl = document.getElementById("meta");
      var modalEl = document.getElementById("modal");
      var clientModalEl = document.getElementById("clientModal");
      var timeModalEl = document.getElementById("timeModal");
      var adminPanel = document.getElementById("adminPanel");
      var settingsPanel = document.getElementById("settingsPanel");
      var clientSuggestions = document.getElementById("clientSuggestions");
      var activeTimeField = "start";
      var pendingTime = { hour: 12, minute: 0 };
      var wheelScrollTimers = {};
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

      function iconGroups() {
        return state && Array.isArray(state.config.iconGroups) ? state.config.iconGroups : [];
      }

      function allIconItems() {
        var items = [];
        iconGroups().forEach(function (group) {
          (group.items || []).forEach(function (item) {
            items.push({ groupKey: group.key, groupTitle: group.title, id: item.id, value: item.value, label: item.label });
          });
        });
        return items;
      }

      function iconItemById(id) {
        return allIconItems().find(function (item) {
          return item.id === id;
        });
      }

      function selectedIconValue() {
        return selectedIconIds
          .map(iconItemById)
          .filter(Boolean)
          .map(function (item) { return item.value; })
          .join("");
      }

      function parseIconIds(iconString) {
        var remaining = String(iconString || "").trim();
        var items = allIconItems().slice().sort(function (left, right) {
          return String(right.value).length - String(left.value).length;
        });
        var result = [];
        while (remaining && result.length < 3) {
          var match = items.find(function (item) {
            return remaining.startsWith(item.value) && !result.includes(item.id);
          });
          if (!match) break;
          result.push(match.id);
          remaining = remaining.slice(match.value.length).trim();
        }
        return result;
      }

      function toggleIcon(id) {
        var existingIndex = selectedIconIds.indexOf(id);
        if (existingIndex >= 0) {
          selectedIconIds.splice(existingIndex, 1);
        } else {
          if (selectedIconIds.length >= 3) {
            setStatus("Maksimum 3 ta icon tanlash mumkin.", true);
            haptic("medium");
            return;
          }
          selectedIconIds.push(id);
        }
        renderIconGrid();
        updatePreview();
        haptic("light");
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

      function addMinutes(time, minutes) {
        var normalized = normalizeTimeInput(time);
        if (!normalized) return "";
        var parts = normalized.split(":").map(Number);
        var total = (parts[0] * 60 + parts[1] + Number(minutes || 0)) % (24 * 60);
        if (total < 0) total += 24 * 60;
        return pad2(Math.floor(total / 60)) + ":" + pad2(total % 60);
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
        var icons = selectedIconValue();
        return [icons ? icons + dateText : dateText, time, client].filter(Boolean).join(" ").trim();
      }

      function timeParts(value, fallback) {
        var normalized = normalizeTimeInput(value);
        if (normalized) {
          var parts = normalized.split(":").map(Number);
          return { hour: parts[0], minute: parts[1] };
        }
        return fallback || { hour: 12, minute: 0 };
      }

      function timeFromParts(parts) {
        return pad2(parts.hour) + ":" + pad2(parts.minute);
      }

      function numberOptions(from, to) {
        var options = [];
        for (var value = from; value <= to; value += 1) {
          options.push(value);
        }
        return options;
      }

      function renderWheelOptions(wheel, values, selected, type) {
        wheel.innerHTML = values.map(function (value) {
          return '<button type="button" class="wheel-option ' + (value === selected ? "active" : "") + '" data-wheel-type="' + type + '" data-wheel-value="' + value + '">' + pad2(value) + '</button>';
        }).join("");
      }

      function markWheelActive(wheel, selected) {
        wheel.querySelectorAll(".wheel-option").forEach(function (option) {
          option.classList.toggle("active", Number(option.getAttribute("data-wheel-value")) === Number(selected));
        });
      }

      function centerWheelOption(wheel, value, smooth) {
        var option = wheel.querySelector('[data-wheel-value="' + Number(value) + '"]');
        if (!option) return;
        requestAnimationFrame(function () {
          option.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
        });
      }

      function renderTimeWheel() {
        var hourWheel = document.getElementById("hourWheel");
        var minuteWheel = document.getElementById("minuteWheel");
        document.getElementById("timeModalTitle").textContent = activeTimeField === "end" ? "Tugash" : "Boshlanish";
        renderWheelOptions(hourWheel, numberOptions(0, 23), pendingTime.hour, "hour");
        renderWheelOptions(minuteWheel, numberOptions(0, 59), pendingTime.minute, "minute");
        centerWheelOption(hourWheel, pendingTime.hour, false);
        centerWheelOption(minuteWheel, pendingTime.minute, false);
      }

      function nearestWheelValue(wheel) {
        var center = wheel.getBoundingClientRect().top + wheel.clientHeight / 2;
        var nearest = null;
        var nearestDistance = Infinity;
        wheel.querySelectorAll(".wheel-option").forEach(function (option) {
          var rect = option.getBoundingClientRect();
          var distance = Math.abs(rect.top + rect.height / 2 - center);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = Number(option.getAttribute("data-wheel-value"));
          }
        });
        return nearest;
      }

      function syncWheelSelection(wheel, type) {
        var value = nearestWheelValue(wheel);
        if (value == null) return;
        if (type === "hour") {
          pendingTime.hour = value;
        } else {
          pendingTime.minute = value;
        }
        markWheelActive(wheel, value);
      }

      function scheduleWheelSync(wheel, type) {
        clearTimeout(wheelScrollTimers[type]);
        wheelScrollTimers[type] = setTimeout(function () {
          syncWheelSelection(wheel, type);
        }, 80);
      }

      function openTimeModal(field) {
        activeTimeField = field === "end" ? "end" : "start";
        var startInput = document.getElementById("startTimeInput");
        var endInput = document.getElementById("endTimeInput");
        var fallback = { hour: 12, minute: 0 };
        if (activeTimeField === "end" && startInput.value) {
          fallback = timeParts(addMinutes(startInput.value, 60));
        }
        var currentValue = activeTimeField === "end" ? endInput.value : startInput.value;
        pendingTime = timeParts(currentValue, fallback);
        renderTimeWheel();
        timeModalEl.classList.add("open");
        timeModalEl.setAttribute("aria-hidden", "false");
        haptic("light");
      }

      function openTimeFromTrigger(event, field) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        if (document.activeElement && typeof document.activeElement.blur === "function") {
          document.activeElement.blur();
        }
        openTimeModal(field);
      }

      function closeTimeModal() {
        timeModalEl.classList.remove("open");
        timeModalEl.setAttribute("aria-hidden", "true");
      }

      function applyTimeSelection() {
        syncWheelSelection(document.getElementById("hourWheel"), "hour");
        syncWheelSelection(document.getElementById("minuteWheel"), "minute");
        var selected = timeFromParts(pendingTime);
        var startInput = document.getElementById("startTimeInput");
        var endInput = document.getElementById("endTimeInput");
        if (activeTimeField === "end") {
          endInput.value = selected;
        } else {
          startInput.value = selected;
          if (!endInput.value) {
            endInput.value = addMinutes(selected, 60);
          }
        }
        updatePreview();
        closeTimeModal();
        haptic("success");
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

      function cardOrderValue(card) {
        var value = Number(card.sortOrder);
        return Number.isFinite(value) ? value : 0;
      }

      function cardsForColumn(columnId) {
        return (state.cards || [])
          .filter(function (card) {
            return Number(card.columnId) === Number(columnId);
          })
          .sort(function (left, right) {
            var orderDiff = cardOrderValue(left) - cardOrderValue(right);
            if (orderDiff !== 0) {
              return orderDiff;
            }
            return Number(left.id || 0) - Number(right.id || 0);
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

      function tagClass(tag, index) {
        var raw = String(tag && tag.color ? tag.color : "").replace(/\D/g, "");
        var number = raw ? Number(raw) : index + 1;
        return "c" + ((number % 5) + 1);
      }

      function renderTag(tag, index) {
        var name = typeof tag === "string" ? tag : tag && tag.name ? tag.name : "";
        if (!name) return "";
        return '<span class="staff-pill ' + tagClass(tag, index) + '">' + escapeText(name) + '</span>';
      }

      function renderCard(card) {
        var tags = Array.isArray(card.tags) ? card.tags : [];
        var tagHtml = tags.map(renderTag).filter(Boolean).join("");
        return '<article class="card" role="button" tabindex="0" data-card-id="' + card.id + '">' +
          '<div class="card-title">' + escapeText(card.title) + '</div>' +
          (tagHtml ? '<div class="tag-list">' + tagHtml + '</div>' : '') +
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
        document.querySelectorAll(".card.drop-before").forEach(function (card) {
          card.classList.remove("drop-before");
        });
        document.querySelectorAll(".cards.drop-end").forEach(function (cards) {
          cards.classList.remove("drop-end");
        });
      }

      function columnAtPoint(x, y) {
        var element = document.elementFromPoint(x, y);
        return element ? element.closest("[data-column-id]") : null;
      }

      function dropInfoForColumn(column, y) {
        var columnId = Number(column.getAttribute("data-column-id"));
        var cardElements = Array.prototype.slice.call(column.querySelectorAll("[data-card-id]"))
          .filter(function (element) {
            return !dragState || String(element.getAttribute("data-card-id")) !== String(dragState.card.id);
          });
        var beforeElement = null;
        for (var index = 0; index < cardElements.length; index += 1) {
          var rect = cardElements[index].getBoundingClientRect();
          if (y < rect.top + rect.height / 2) {
            beforeElement = cardElements[index];
            break;
          }
        }
        var orderedIds = cardsForColumn(columnId)
          .map(function (card) { return String(card.id); })
          .filter(function (id) {
            return !dragState || id !== String(dragState.card.id);
          });
        var beforeId = beforeElement ? beforeElement.getAttribute("data-card-id") : null;
        var beforeIndex = beforeId ? orderedIds.indexOf(String(beforeId)) : orderedIds.length;
        var prevCardId = beforeIndex > 0 ? orderedIds[beforeIndex - 1] : null;
        return {
          columnId: columnId,
          prevCardId: prevCardId ? Number(prevCardId) : null,
          beforeElement: beforeElement,
          atEnd: !beforeElement,
        };
      }

      function previousCardId(card) {
        var cards = cardsForColumn(card.columnId);
        var index = cards.findIndex(function (item) {
          return String(item.id) === String(card.id);
        });
        return index > 0 ? Number(cards[index - 1].id) : null;
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
          var dropInfo = dropInfoForColumn(column, y);
          dragState.targetColumnId = dropInfo.columnId;
          dragState.targetPrevCardId = dropInfo.prevCardId;
          if (dropInfo.beforeElement) {
            dropInfo.beforeElement.classList.add("drop-before");
          } else {
            var cardsEl = column.querySelector(".cards");
            if (cardsEl) {
              cardsEl.classList.add("drop-end");
            }
          }
        } else {
          dragState.targetColumnId = null;
          dragState.targetPrevCardId = null;
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
        var targetPrevCardId = dragState.targetPrevCardId;
        var sourceColumnId = Number(card.columnId);
        var sourcePrevCardId = previousCardId(card);
        cleanupDrag();
        if (!active) return;
        suppressClickUntil = Date.now() + 900;
        if (!targetColumnId || (targetColumnId === sourceColumnId && targetPrevCardId === sourcePrevCardId)) {
          setStatus("Card joyi o'zgarmadi.");
          return;
        }
        setStatus("Card ko'chirilmoqda...");
        try {
          var data = await api("/api/cards/" + card.id + "/move", {
            method: "POST",
            body: { columnId: targetColumnId, prevCardId: targetPrevCardId }
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
          targetPrevCardId: previousCardId(card),
          ghost: null
        };
        cardButton.classList.add("pressed");
        dragState.timer = setTimeout(beginDrag, 420);
        window.addEventListener("pointermove", onDragPointerMove, { passive: false });
        window.addEventListener("pointerup", onDragPointerUp);
        window.addEventListener("pointercancel", onDragPointerCancel);
      }

      function renderIconChoice(item) {
        var active = selectedIconIds.includes(item.id);
        var disabled = !active && selectedIconIds.length >= 3;
        return '<button type="button" class="icon-choice ' + (active ? "active" : "") + '" data-icon-id="' + escapeText(item.id) + '" ' + (disabled ? "disabled" : "") + ' aria-pressed="' + (active ? "true" : "false") + '">' +
          '<span class="icon-emoji">' + escapeText(item.value) + '</span><span>' + escapeText(item.label) + '</span>' +
        '</button>';
      }

      function renderIconGrid() {
        var selectedText = selectedIconValue() || "Icon tanlanmagan";
        document.getElementById("iconGrid").innerHTML =
          '<div class="icon-selection"><div class="icon-preview">' + escapeText(selectedText) + '</div><div class="icon-count">' + selectedIconIds.length + ' / 3</div></div>' +
          iconGroups().map(function (group) {
            return '<section class="icon-group">' +
              '<div class="icon-group-title">' + escapeText(group.title) + '</div>' +
              '<div class="icon-options">' + (group.items || []).map(renderIconChoice).join("") + '</div>' +
            '</section>';
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
          selectedIconIds = parseIconIds(parsed.icon);
          if (!selectedIconIds.length) {
            selectedIconIds = ["main-shooting"];
          }
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
          selectedIconIds = ["main-shooting"];
          document.getElementById("dateInput").value = new Date().toISOString().slice(0, 10);
          document.getElementById("columnInput").value = state.config.columns[0].id;
          document.getElementById("titleInput").value = "";
          document.getElementById("dateInput").required = true;
          document.getElementById("startTimeInput").required = true;
          document.getElementById("clientInput").required = true;
        }
        activeTimeField = "start";
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
            icon: selectedIconValue(),
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
          if (data.client && data.client.alreadyExists) {
            setStatus("Bu mijoz Google Sheetsda avvaldan bor: row " + (data.client.row || "-") + ".");
          } else {
            setStatus("Mijoz Google Sheetsga yozildi: row " + (data.client.row || "-") + ". Yangi syomkada tanlash mumkin.");
          }
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
      document.getElementById("closeTimeModal").addEventListener("click", closeTimeModal);
      document.getElementById("applyTimeModal").addEventListener("click", applyTimeSelection);
      modalEl.addEventListener("click", function (event) {
        if (event.target === modalEl) {
          closeModal();
        }
      });
      clientModalEl.addEventListener("click", function (event) {
        if (event.target === clientModalEl) {
          closeClientModal();
        }
      });
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
      function attachTimeTrigger(id, field) {
        var input = document.getElementById(id);
        input.addEventListener("pointerdown", function (event) {
          openTimeFromTrigger(event, field);
        });
        input.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            openTimeFromTrigger(event, field);
          }
        });
      }
      attachTimeTrigger("startTimeInput", "start");
      attachTimeTrigger("endTimeInput", "end");
      timeModalEl.addEventListener("click", function (event) {
        if (event.target === timeModalEl) {
          closeTimeModal();
        }
      });
      ["hourWheel", "minuteWheel"].forEach(function (id) {
        var wheel = document.getElementById(id);
        var type = id === "hourWheel" ? "hour" : "minute";
        wheel.addEventListener("scroll", function () {
          scheduleWheelSync(wheel, type);
        });
        wheel.addEventListener("click", function (event) {
          var button = event.target.closest("[data-wheel-value]");
          if (!button) return;
          var value = Number(button.getAttribute("data-wheel-value"));
          if (type === "hour") {
            pendingTime.hour = value;
          } else {
            pendingTime.minute = value;
          }
          markWheelActive(wheel, value);
          centerWheelOption(wheel, value, true);
          haptic("light");
        });
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
        var button = event.target.closest("[data-icon-id]");
        if (!button) return;
        toggleIcon(button.getAttribute("data-icon-id"));
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
