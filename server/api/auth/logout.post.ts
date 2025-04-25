export default defineEventHandler(async (event) => {
  const sid = getCookie(event, "sid");
  const kv = hubKV();

  if (sid) {
    // Delete session from KV
    await kv.remove(`sess:${sid}`);

    // Clear the cookie
    setCookie(event, "sid", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }

  return { success: true };
});
