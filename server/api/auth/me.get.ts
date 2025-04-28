import { users } from "../../database/schema";
import { eq } from "drizzle-orm";
import { extendSession, type SessionData } from "../../utils/session";

export default defineEventHandler(async (event) => {
  const sid = getCookie(event, "sid");
  if (!sid) return null;

  const kv = hubKV();
  const session = await kv.get<SessionData>(`sess:${sid}`);
  if (!session?.userId) return null;
  await extendSession(event, sid, session);
  const db = useDrizzle();
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
    columns: { id: true, email: true, firstName: true, lastName: true },
  });

  return user || null;
});
