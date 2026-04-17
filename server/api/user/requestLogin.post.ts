import { UUID } from "crypto";
import { usePostgres } from "../../utils/postgres";

export default defineEventHandler(async (event) => {

  const body: {
    email: string;
  } = await readBody(event);

  const otpCode = Array(6).fill(0).map(() => Math.min(Math.floor(Math.random() * 10), 9)).join('');

  const sql = usePostgres();
  const result: UUID[] = await sql`
      UPDATE users
      SET otp = ${otpCode}
      WHERE email = ${body.email}
      RETURNING id
    ` as any;

  if (result.length != 1) throw createError({ status: 404, statusText: "User not found" })

  console.log(`login requested for ${body.email} => set otp to ${otpCode}`)

  return {}
})
