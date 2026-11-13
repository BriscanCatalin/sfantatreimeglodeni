import { describe, expect, it } from "vitest";
import { handleEventApi } from "@/lib/events-api";
import server from "@/server";

describe("Events API", () => {
  it("does not allow public requests to create events", async () => {
    const response = await handleEventApi(
      new Request("https://sfantatreimeglodeni.com/admin/api/events", {
        method: "POST",
      }),
      {},
    );

    expect(response?.status).toBe(401);
  });

  it("creates a signed admin session after password verification", async () => {
    const password = "p".repeat(32);
    const origin = "https://sfantatreimeglodeni.com";
    const response = await handleEventApi(
      new Request(`${origin}/admin/api/login`, {
        method: "POST",
        headers: {
          origin,
          "content-type": "application/json",
        },
        body: JSON.stringify({ password }),
      }),
      { EVENTS_ADMIN_PASSWORD: password },
    );

    if (!response) throw new Error("Login API route was not handled.");
    expect(response.status).toBe(200);
    const cookie = response.headers.get("set-cookie");
    if (!cookie) throw new Error("Admin session cookie was not set.");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Strict");
    expect(cookie).toContain("Secure");
    const cookiePair = cookie.split(";")[0];
    if (!cookiePair) throw new Error("Admin session cookie was malformed.");

    const session = await handleEventApi(
      new Request(`${origin}/admin/api/session`, {
        headers: { cookie: cookiePair },
      }),
      { EVENTS_ADMIN_PASSWORD: password },
    );
    expect(await session?.json()).toEqual({ authorized: true });

    const [cookieName, token] = cookiePair.split("=");
    if (!token) throw new Error("Admin session token was missing.");
    const [payload, signature] = token.split(".");
    if (!payload || !signature)
      throw new Error("Admin session token was malformed.");
    const tamperedSignature = `${signature[0] === "A" ? "B" : "A"}${signature.slice(1)}`;
    const tamperedSession = await handleEventApi(
      new Request(`${origin}/admin/api/session`, {
        headers: { cookie: `${cookieName}=${payload}.${tamperedSignature}` },
      }),
      { EVENTS_ADMIN_PASSWORD: password },
    );
    expect(tamperedSession?.status).toBe(401);
  });

  it("rejects incorrect passwords and cross-origin logins", async () => {
    const origin = "https://sfantatreimeglodeni.com";
    const environment = { EVENTS_ADMIN_PASSWORD: "p".repeat(32) };
    const incorrectPassword = await handleEventApi(
      new Request(`${origin}/admin/api/login`, {
        method: "POST",
        headers: {
          origin,
          "content-type": "application/json",
        },
        body: JSON.stringify({ password: "wrong password" }),
      }),
      environment,
    );
    expect(incorrectPassword?.status).toBe(401);

    const crossOrigin = await handleEventApi(
      new Request(`${origin}/admin/api/login`, {
        method: "POST",
        headers: {
          origin: "https://attacker.example",
          "content-type": "application/json",
        },
        body: JSON.stringify({ password: "p".repeat(32) }),
      }),
      environment,
    );
    expect(crossOrigin?.status).toBe(403);
  });

  it("fails closed when the production admin password is not configured", async () => {
    const origin = "https://sfantatreimeglodeni.com";
    const response = await handleEventApi(
      new Request(`${origin}/admin/api/login`, {
        method: "POST",
        headers: {
          origin,
          "content-type": "application/json",
        },
        body: JSON.stringify({ password: "p".repeat(32) }),
      }),
      {},
    );

    expect(response?.status).toBe(503);
  });

  it("uses Nitro's Cloudflare environment when handling Worker requests", async () => {
    const runtime = globalThis as typeof globalThis & { __env__?: unknown };
    const previousEnvironment = runtime.__env__;
    runtime.__env__ = {
      EVENTS_KV: {
        get: async () => null,
        put: async () => undefined,
        delete: async () => undefined,
        list: async () => ({ keys: [], list_complete: true }),
      },
    };

    try {
      const response = await server.fetch(
        new Request("https://sfantatreimeglodeni.com/api/public/events"),
        undefined,
        undefined,
      );

      expect(response.status).toBe(200);
      expect((await response.json()).events).toHaveLength(1);
    } finally {
      if (previousEnvironment === undefined) {
        delete runtime.__env__;
      } else {
        runtime.__env__ = previousEnvironment;
      }
    }
  });

  it("returns the featured event and events saved in storage", async () => {
    const savedEvent = {
      id: "stored-event",
      title: "Seară de rugăciune",
      organizer: "Biserica Sfânta Treime",
      date: "2026-11-15",
      time: "18:00",
      venue: "Glodeni",
      description: "O seară împreună.",
      entrance: "",
      imageKey: null,
      createdAt: "2026-11-13T10:00:00.000Z",
    };
    const kv = {
      get: async () => JSON.stringify(savedEvent),
      put: async () => undefined,
      delete: async () => undefined,
      list: async () => ({
        keys: [{ name: "events/stored-event.json" }],
        list_complete: true,
      }),
    };

    const response = await handleEventApi(
      new Request("https://sfantatreimeglodeni.com/api/public/events"),
      { EVENTS_KV: kv },
    );
    const result = (await response?.json()) as {
      events: Array<{ id: string; title: string; imageUrl: string | null }>;
    };

    expect(response?.status).toBe(200);
    expect(result.events.map(({ id }) => id)).toEqual([
      "rugul-aprins-2026",
      "stored-event",
    ]);
    expect(result.events[1]?.title).toBe("Seară de rugăciune");
  });

  it("serves uploaded images as binary data from KV", async () => {
    const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer;
    const kv = {
      get: async (_key: string, type?: string) =>
        type === "arrayBuffer" ? bytes : null,
    };

    const response = await handleEventApi(
      new Request(
        "https://sfantatreimeglodeni.com/api/event-images/123e4567-e89b-12d3-a456-426614174000.png",
      ),
      { EVENTS_KV: kv },
    );

    if (!response) throw new Error("Image API route was not handled.");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect([...new Uint8Array(await response.arrayBuffer())]).toEqual([
      0x89, 0x50, 0x4e, 0x47,
    ]);
  });
});
