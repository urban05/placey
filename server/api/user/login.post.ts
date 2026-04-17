import { UUID } from "crypto";
import { usePostgres } from "../../utils/postgres";

export default defineEventHandler(async (event) => {

    const body: {
        email: string;
        otp: string;
    } = await readBody(event);

    const sql = usePostgres();
    const result: {
        id: UUID;
        username: string;
    }[] = await sql`
      UPDATE users
      SET otp = NULL
      WHERE email = ${body.email} AND otp = ${body.otp}
      RETURNING id, username
    ` as any;

    if (result.length != 1) throw createError({ status: 403, statusText: "User not found or otp wrong" })

    return {
        id: result[0]!.id,
        email: body.email,
        username: result[0]!.username,
        token: sign(result[0]!.id)
    }
})
