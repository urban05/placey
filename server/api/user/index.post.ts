import { randomUUID } from "crypto";
import { usePostgres } from "../../utils/postgres";

export default defineEventHandler(async (event) => {
  const body: {
    email: string;
    username: string;
  } = await readBody(event);

  const id = randomUUID();

  const sql = usePostgres();

  const mailResult = await sql`
        SELECT id
        FROM users
        WHERE email = ${body.email}
      `;

  if (mailResult.length > 0) throw createError({ status: 409, statusText: "email already registered" })

  const usernameResult = await sql`
        SELECT id
        FROM users
        WHERE username = ${body.username}
      `;

  if (usernameResult.length > 0) throw createError({ status: 409, statusText: "username already in user" })

  const result = await sql`
        INSERT INTO users (id, email, username)
        VALUES (${id}, ${body.email}, ${body.username})
      `;

  if (result.count != 1) throw createError({ status: 500, statusText: "error creating user" })

  return {}
})
