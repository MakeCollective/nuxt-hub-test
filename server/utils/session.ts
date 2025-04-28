import { hubKV } from "#imports";
import { createId } from "@paralleldrive/cuid2";
import { setCookie, type H3Event } from "h3";
export const sessionTTL = 60 * 60 * 24 * 30; // 30 days in seconds

export interface SessionData {
  userId: string;
  createdAt: number;
}

export async function createSession(event: H3Event, userId: string) {
  const sid = createId(); // generates your cuid-based sid
  const kv = hubKV();
  const sessionData: SessionData = {
    userId,
    createdAt: Date.now(),
  };
  await kv.set(`sess:${sid}`, sessionData, { ttl: sessionTTL });
  setSessionCookie(event, sid, sessionTTL);
  return { sid, session: sessionData };
}

export async function extendSession(
  event: H3Event,
  sid: string,
  session: SessionData,
) {
  const kv = hubKV();
  await kv.set(`sess:${sid}`, session, { ttl: sessionTTL });
  setSessionCookie(event, sid, sessionTTL);
}

export function setSessionCookie(event: H3Event, sid: string, ttl: number) {
  const config = useRuntimeConfig();

  setCookie(event, "sid", sid, {
    httpOnly: true,
    secure: config.auth.cookieSecure,
    sameSite:
      (config.auth.cookieSameSite as "lax" | "strict" | "none") || "lax",
    path: "/",
    maxAge: ttl,
  });
}
