import { users } from "../../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const sid = getCookie(event, "sid");
  if (!sid) return null;

  const kv = hubKV();
  const session = await kv.get<{ userId: string }>(`sess:${sid}`);
  if (!session?.userId) return null;

  const db = useDrizzle();
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
    columns: { id: true, email: true },
  });

  return user || null;
});
