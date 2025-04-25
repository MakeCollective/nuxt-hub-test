import { setCookie, type H3Event } from "h3";

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
