import { featuredEvents, type EventRecord } from "./events";

const ADMIN_PASSWORD_MIN_LENGTH = 32;
const ADMIN_SESSION_SECONDS = 8 * 60 * 60;
const ADMIN_SESSION_COOKIE = "events_admin_session";
const encoder = new TextEncoder();

interface EventsKv {
  get(
    key: string,
    type?: "text" | "arrayBuffer",
  ): Promise<string | ArrayBuffer | null>;
  put(key: string, value: string | ArrayBuffer): Promise<void>;
  delete(key: string): Promise<void>;
  list(options: { prefix: string; limit: number; cursor?: string }): Promise<{
    keys: Array<{ name: string }>;
    list_complete: boolean;
    cursor?: string;
  }>;
}

interface EventEnvironment {
  EVENTS_KV?: EventsKv;
  EVENTS_ADMIN_PASSWORD?: string;
}

interface StoredEvent extends Omit<
  EventRecord,
  "imageUrl" | "date" | "scheduleLabel" | "isPermanent"
> {
  date: string;
  imageKey: string | null;
  createdAt: string;
}

class EventFormError extends Error {}

const developmentObjects = new Map<string, string | ArrayBuffer>();

const developmentKv: EventsKv = {
  async get(key, type = "text") {
    const stored = developmentObjects.get(key);
    if (stored === undefined) return null;
    if (type === "arrayBuffer") {
      return typeof stored === "string"
        ? new Response(stored).arrayBuffer()
        : stored.slice(0);
    }
    return typeof stored === "string"
      ? stored
      : new TextDecoder().decode(stored);
  },
  async put(key, value) {
    developmentObjects.set(
      key,
      typeof value === "string" ? value : value.slice(0),
    );
  },
  async delete(key) {
    developmentObjects.delete(key);
  },
  async list({ prefix, cursor, limit }) {
    const keys = [...developmentObjects.keys()]
      .filter((key) => key.startsWith(prefix))
      .sort();
    const start = cursor ? Number(cursor) : 0;
    if (!Number.isSafeInteger(start) || start < 0)
      throw new Error("Local event storage returned an invalid cursor.");
    const pageKeys = keys.slice(start, start + limit);
    const listComplete = start + pageKeys.length >= keys.length;
    return {
      keys: pageKeys.map((name) => ({ name })),
      list_complete: listComplete,
      ...(!listComplete ? { cursor: String(start + pageKeys.length) } : {}),
    };
  },
};

function getEnvironment(value: unknown): EventEnvironment {
  return typeof value === "object" && value !== null
    ? (value as EventEnvironment)
    : {};
}

function isLocalRequest(request: Request): boolean {
  const hostname = new URL(request.url).hostname;
  return hostname === "127.0.0.1" || hostname === "localhost";
}

function getEventsKv(request: Request, value: unknown): EventsKv | null {
  const environment = getEnvironment(value);
  if (environment.EVENTS_KV) return environment.EVENTS_KV;
  return import.meta.env.DEV && isLocalRequest(request) ? developmentKv : null;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index]! ^ right[index]!;
  }
  return difference === 0;
}

async function getAdminPasswordDigest(password: string): Promise<Uint8Array> {
  return new Uint8Array(
    await crypto.subtle.digest("SHA-256", encoder.encode(password)),
  );
}

async function signAdminSession(
  password: string,
  payload: string,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(payload)),
  );
}

function getAdminPassword(value: unknown): string | null {
  const password = getEnvironment(value).EVENTS_ADMIN_PASSWORD;
  return password && password.length >= ADMIN_PASSWORD_MIN_LENGTH
    ? password
    : null;
}

function getAdminSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  for (const cookie of cookieHeader.split(";")) {
    const [name, ...valueParts] = cookie.trim().split("=");
    if (name === ADMIN_SESSION_COOKIE) return valueParts.join("=") || null;
  }
  return null;
}

async function hasEventAdminSession(
  request: Request,
  value: unknown,
): Promise<boolean> {
  if (import.meta.env.DEV && isLocalRequest(request)) return true;
  if (new URL(request.url).protocol !== "https:") return false;
  const password = getAdminPassword(value);
  const token = getAdminSessionToken(request);
  if (!password || !token) return false;

  const [encodedPayload, encodedSignature, extra] = token.split(".");
  if (!encodedPayload || !encodedSignature || extra !== undefined) return false;
  const signature = decodeBase64Url(encodedSignature);
  const payloadBytes = decodeBase64Url(encodedPayload);
  if (!signature || !payloadBytes) return false;

  const expectedSignature = await signAdminSession(password, encodedPayload);
  if (!constantTimeEqual(signature, expectedSignature)) return false;

  try {
    const payload: unknown = JSON.parse(new TextDecoder().decode(payloadBytes));
    if (typeof payload !== "object" || payload === null) return false;
    const claims = payload as Record<string, unknown>;
    const expiresAt = claims["exp"];
    return (
      claims["sub"] === "event-admin" &&
      typeof expiresAt === "number" &&
      expiresAt > Date.now() / 1000
    );
  } catch {
    return false;
  }
}

function hasSameOrigin(request: Request): boolean {
  return request.headers.get("origin") === new URL(request.url).origin;
}

function adminSessionCookie(request: Request, token: string): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${ADMIN_SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/admin; Max-Age=${ADMIN_SESSION_SECONDS}${secure}`;
}

async function handleAdminLogin(
  request: Request,
  value: unknown,
): Promise<Response> {
  if (request.method !== "POST")
    return jsonResponse({ error: "Metoda nu este permisă." }, 405);
  if (!hasSameOrigin(request))
    return jsonResponse({ error: "Cererea nu este permisă." }, 403);
  if (new URL(request.url).protocol !== "https:" && !isLocalRequest(request))
    return jsonResponse({ error: "Autentificarea necesită HTTPS." }, 403);
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4096)
    return jsonResponse({ error: "Cererea este prea mare." }, 413);

  const adminPassword = getAdminPassword(value);
  if (!adminPassword) {
    return jsonResponse(
      { error: "Parola administratorului nu este configurată corect." },
      503,
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      { error: "Cererea de autentificare nu este validă." },
      400,
    );
  }
  const password =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)["password"]
      : undefined;
  if (typeof password !== "string" || password.length > 1024) {
    return jsonResponse({ error: "Parola nu este validă." }, 400);
  }

  const [submittedDigest, configuredDigest] = await Promise.all([
    getAdminPasswordDigest(password),
    getAdminPasswordDigest(adminPassword),
  ]);
  if (!constantTimeEqual(submittedDigest, configuredDigest)) {
    return jsonResponse({ error: "Parolă incorectă." }, 401);
  }

  const encodedPayload = encodeBase64Url(
    encoder.encode(
      JSON.stringify({
        sub: "event-admin",
        exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS,
      }),
    ),
  );
  const signature = await signAdminSession(adminPassword, encodedPayload);
  const token = `${encodedPayload}.${encodeBase64Url(signature)}`;
  return Response.json(
    { authorized: true },
    {
      headers: {
        "cache-control": "no-store",
        "set-cookie": adminSessionCookie(request, token),
      },
    },
  );
}

async function handleAdminLogout(request: Request): Promise<Response> {
  if (request.method !== "POST")
    return jsonResponse({ error: "Metoda nu este permisă." }, 405);
  if (!hasSameOrigin(request))
    return jsonResponse({ error: "Cererea nu este permisă." }, 403);
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return new Response(null, {
    status: 204,
    headers: {
      "cache-control": "no-store",
      "set-cookie": `${ADMIN_SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/admin; Max-Age=0${secure}`,
    },
  });
}

function jsonResponse(
  body: unknown,
  status = 200,
  cacheControl = "no-store",
): Response {
  return Response.json(body, {
    status,
    headers: { "cache-control": cacheControl },
  });
}

function isStoredEvent(value: unknown): value is StoredEvent {
  if (typeof value !== "object" || value === null) return false;
  const event = value as Record<string, unknown>;
  return (
    typeof event["id"] === "string" &&
    typeof event["title"] === "string" &&
    typeof event["organizer"] === "string" &&
    typeof event["date"] === "string" &&
    typeof event["time"] === "string" &&
    typeof event["venue"] === "string" &&
    typeof event["description"] === "string" &&
    typeof event["entrance"] === "string" &&
    (event["imageKey"] === null || typeof event["imageKey"] === "string") &&
    typeof event["createdAt"] === "string"
  );
}

async function readStoredEvents(kv: EventsKv): Promise<StoredEvent[]> {
  const keys: string[] = [];
  let cursor: string | undefined;
  let pageCount = 0;

  do {
    const page = await kv.list({
      prefix: "events/",
      limit: 1000,
      ...(cursor ? { cursor } : {}),
    });
    keys.push(...page.keys.map(({ name }) => name));
    cursor = page.list_complete ? undefined : page.cursor;
    pageCount += 1;
    if (!page.list_complete && !cursor)
      throw new Error("Event storage returned an invalid cursor.");
    if (pageCount > 100)
      throw new Error("Event listing exceeded the configured safety limit.");
  } while (cursor);

  return Promise.all(
    keys.map(async (key) => {
      const value = await kv.get(key, "text");
      if (typeof value !== "string")
        throw new Error(`Event record disappeared while reading: ${key}`);
      const event: unknown = JSON.parse(value);
      if (!isStoredEvent(event))
        throw new Error(`Invalid stored event record: ${key}`);
      return event;
    }),
  );
}

function toPublicEvent(event: StoredEvent): EventRecord {
  const imageId = event.imageKey?.startsWith("images/")
    ? event.imageKey.slice("images/".length)
    : null;
  return {
    id: event.id,
    title: event.title,
    organizer: event.organizer,
    date: event.date,
    time: event.time,
    venue: event.venue,
    description: event.description,
    entrance: event.entrance,
    imageUrl: imageId ? `/api/event-images/${imageId}` : null,
  };
}

function getRequiredField(
  form: FormData,
  name: string,
  label: string,
  maximumLength: number,
): string {
  const value = form.get(name);
  if (typeof value !== "string")
    throw new EventFormError(`Completează câmpul „${label}”.`);
  const trimmed = value.trim();
  if (!trimmed) throw new EventFormError(`Completează câmpul „${label}”.`);
  if (trimmed.length > maximumLength) {
    throw new EventFormError(
      `Câmpul „${label}” depășește limita de ${maximumLength} caractere.`,
    );
  }
  return trimmed;
}

function validateDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(date.valueOf()) &&
    date.toISOString().slice(0, 10) === value
  );
}

async function getImageType(
  file: File,
): Promise<{ extension: string; bytes: ArrayBuffer }> {
  if (file.size > 5 * 1024 * 1024) {
    throw new EventFormError("Imaginea trebuie să aibă cel mult 5 MB.");
  }

  const bytes = await file.arrayBuffer();
  const header = new Uint8Array(bytes);
  const isPng =
    header.length >= 8 &&
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47 &&
    header[4] === 0x0d &&
    header[5] === 0x0a &&
    header[6] === 0x1a &&
    header[7] === 0x0a;
  const isJpeg =
    header.length >= 3 &&
    header[0] === 0xff &&
    header[1] === 0xd8 &&
    header[2] === 0xff;
  const isWebp =
    header.length >= 12 &&
    new TextDecoder().decode(header.slice(0, 4)) === "RIFF" &&
    new TextDecoder().decode(header.slice(8, 12)) === "WEBP";

  if (file.type === "image/png" && isPng) return { extension: "png", bytes };
  if (file.type === "image/jpeg" && isJpeg) return { extension: "jpg", bytes };
  if (file.type === "image/webp" && isWebp) return { extension: "webp", bytes };
  throw new EventFormError("Încarcă o fotografie JPEG, PNG sau WebP validă.");
}

async function createEvent(request: Request, kv: EventsKv): Promise<Response> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 6 * 1024 * 1024) {
    return jsonResponse({ error: "Cererea depășește limita de 6 MB." }, 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ error: "Formularul nu a putut fi citit." }, 400);
  }

  let imageKey: string | null = null;
  let storedImage = false;
  try {
    const title = getRequiredField(form, "title", "Titlul evenimentului", 120);
    const organizer = getRequiredField(form, "organizer", "Organizatorul", 120);
    const date = getRequiredField(form, "date", "Data", 10);
    const time = getRequiredField(form, "time", "Ora", 5);
    const venue = getRequiredField(form, "venue", "Locația", 200);
    const description = getRequiredField(
      form,
      "description",
      "Descrierea",
      2000,
    );
    const entranceValue = form.get("entrance");
    const entrance =
      typeof entranceValue === "string"
        ? entranceValue.trim().slice(0, 100)
        : "";

    if (!validateDate(date)) throw new EventFormError("Alege o dată validă.");
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      throw new EventFormError("Alege o oră validă.");
    }

    const imageValue = form.get("image");
    if (
      imageValue !== null &&
      typeof imageValue !== "string" &&
      imageValue.size > 0
    ) {
      const { extension, bytes } = await getImageType(imageValue);
      imageKey = `images/${crypto.randomUUID()}.${extension}`;
      await kv.put(imageKey, bytes);
      storedImage = true;
    }

    const event: StoredEvent = {
      id: crypto.randomUUID(),
      title,
      organizer,
      date,
      time,
      venue,
      description,
      entrance,
      imageKey,
      createdAt: new Date().toISOString(),
    };
    await kv.put(`events/${event.id}.json`, JSON.stringify(event));

    return jsonResponse(toPublicEvent(event), 201);
  } catch (error) {
    if (storedImage && imageKey) {
      try {
        await kv.delete(imageKey);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up an orphaned event image.",
          cleanupError,
        );
      }
    }
    if (error instanceof EventFormError) {
      return jsonResponse({ error: error.message }, 400);
    }
    console.error("Failed to save an event.", error);
    return jsonResponse({ error: "Evenimentul nu a putut fi salvat." }, 500);
  }
}

async function handlePublicEvents(
  request: Request,
  kv: EventsKv | null,
): Promise<Response> {
  if (request.method !== "GET") {
    return jsonResponse({ error: "Metoda nu este permisă." }, 405);
  }
  if (!kv) {
    return jsonResponse(
      { error: "Stocarea evenimentelor nu este configurată." },
      503,
    );
  }

  try {
    const storedEvents = await readStoredEvents(kv);
    const events = [...featuredEvents, ...storedEvents.map(toPublicEvent)].sort(
      (left, right) => {
        const permanentOrder =
          Number(right.isPermanent === true) -
          Number(left.isPermanent === true);
        if (permanentOrder !== 0) return permanentOrder;
        return (
          (right.date ?? "").localeCompare(left.date ?? "") ||
          right.time.localeCompare(left.time)
        );
      },
    );
    return jsonResponse({ events }, 200, "public, max-age=60");
  } catch (error) {
    console.error("Failed to load events.", error);
    return jsonResponse(
      { error: "Evenimentele nu au putut fi încărcate." },
      500,
    );
  }
}

async function handleEventImage(
  request: Request,
  kv: EventsKv | null,
  imageId: string,
): Promise<Response> {
  if (request.method !== "GET") {
    return jsonResponse({ error: "Metoda nu este permisă." }, 405);
  }
  if (!/^[0-9a-f-]{36}\.(?:jpg|png|webp)$/.test(imageId) || !kv) {
    return new Response("Imaginea nu a fost găsită.", { status: 404 });
  }

  try {
    const bytes = await kv.get(`images/${imageId}`, "arrayBuffer");
    if (bytes === null)
      return new Response("Imaginea nu a fost găsită.", { status: 404 });
    if (typeof bytes === "string")
      throw new Error(
        "Event image storage returned text instead of binary data.",
      );
    const contentType = imageId.endsWith(".png")
      ? "image/png"
      : imageId.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";
    return new Response(bytes, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to load an event image.", error);
    return new Response("Imaginea nu a putut fi încărcată.", { status: 500 });
  }
}

export async function handleEventApi(
  request: Request,
  value: unknown,
): Promise<Response | null> {
  const pathname = new URL(request.url).pathname;
  const kv = getEventsKv(request, value);

  if (pathname === "/api/public/events") {
    return handlePublicEvents(request, kv);
  }
  if (pathname.startsWith("/api/event-images/")) {
    return handleEventImage(
      request,
      kv,
      pathname.slice("/api/event-images/".length),
    );
  }
  if (pathname === "/admin/api/login") {
    return handleAdminLogin(request, value);
  }
  if (pathname === "/admin/api/session") {
    if (request.method !== "GET") {
      return jsonResponse({ error: "Metoda nu este permisă." }, 405);
    }
    return (await hasEventAdminSession(request, value))
      ? jsonResponse({ authorized: true })
      : jsonResponse(
          { error: "Autentifică-te pentru a administra evenimente." },
          401,
        );
  }
  if (pathname === "/admin/api/logout") {
    return handleAdminLogout(request);
  }
  if (pathname === "/admin/api/events") {
    if (request.method !== "POST") {
      return jsonResponse({ error: "Metoda nu este permisă." }, 405);
    }
    if (!(await hasEventAdminSession(request, value))) {
      return jsonResponse(
        { error: "Autentifică-te pentru a adăuga evenimente." },
        401,
      );
    }
    if (!hasSameOrigin(request))
      return jsonResponse({ error: "Cererea nu este permisă." }, 403);
    if (!kv) {
      return jsonResponse(
        { error: "Stocarea evenimentelor nu este configurată." },
        503,
      );
    }
    return createEvent(request, kv);
  }
  return null;
}
