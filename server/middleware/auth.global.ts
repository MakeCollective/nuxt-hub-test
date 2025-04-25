export default defineEventHandler(async (event) => {
  const sid = getCookie(event, "sid");

  if (!sid) return; // not authenticated, let the route handle it

  const kv = hubKV();
  const session = await kv.get<{ userId: string }>(`sess:${sid}`);

  if (session?.userId) {
    event.context.userId = session.userId;
  }
});
