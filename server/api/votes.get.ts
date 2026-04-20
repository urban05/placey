import { checkAuth } from "../utils/auth";
import { usePostgres } from "../utils/postgres";

export default defineEventHandler(async (event) => {
  const id = checkAuth(event)

  const sql = usePostgres();

  const result = await sql`
        SELECT v.place_id AS placeID, (v.vote = 1) as vote
        FROM votes v
        WHERE v.user_id = ${id}
      `;

  return result
})
