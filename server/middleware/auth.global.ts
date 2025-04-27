import { users } from "../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  // If already loaded earlier in the request, skip loading again
  if (event.context.authUser) {
    return;
  }

  // Otherwise check auth/user
  const sid = getCookie(event, "sid");

  if (!sid) return; // not authenticated, let the route handle it

  const kv = hubKV();
  const session = await kv.get<{ userId: string }>(`sess:${sid}`);

  if (!session?.userId) return;

  const db = useDrizzle();
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
    columns: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!user) return;

  event.context.authUser = user;
});
