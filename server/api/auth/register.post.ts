import { defineEventHandler, readBody, createError, sendError } from "h3";
import { users } from "../../database/schema";
import { registerSchema } from "~~/lib/validation/user";
import type { H3Error } from "h3";
import { createId } from "@paralleldrive/cuid2";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid input",
      data: parsed.error.flatten(),
    });
  }

  const { firstName, lastName, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  const passwordHashValue = await hashPassword(password);

  try {
    // Create the user in the DB
    const db = useDrizzle();

    const [user] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        passwordHash: passwordHashValue,
        firstName,
        lastName,
        createdAt: Math.floor(Date.now() / 1000),
      })
      .returning({ id: users.id });

    // Auto Log in by setting the session in KV

    const kv = hubKV();
    // Generate a secure session ID and store it in KV
    const sid = createId();
    const sessionTTL = 60 * 60 * 24 * 30; // 30 days

    await kv.set(
      `sess:${sid}`,
      {
        userId: user.id,
        createdAt: Date.now(),
      },
      { ttl: sessionTTL },
    );

    // Set session cookie
    setSessionCookie(event, sid, sessionTTL);
    //Return basic response
    return { success: true };
  } catch (err: unknown) {
    const error = err as H3Error;

    if (error?.message?.includes("UNIQUE constraint failed")) {
      return sendError(
        event,
        createError({
          statusCode: 409,
          statusMessage: "Email already registered",
        }),
      );
    }

    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: error.message || "It died",
        data: error,
      }),
    );
  }
});
