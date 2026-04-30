import { UUID } from "node:crypto";
import { checkAuth } from "../utils/auth";
import { usePostgres } from "../utils/postgres";

export default defineEventHandler(async (event) => {
  const id = checkAuth(event);

  const body: {
    placeId: UUID;
    vote: boolean | null;
  } = await readBody(event);

  const sql = usePostgres();

  if (body.vote == null) {
    await sql`
      DELETE FROM votes v
      WHERE v.user_id = ${id} AND v.place_id = ${body.placeId}
      `;
  } else {
    const vote = body.vote ? 1 : -1;

    await sql`
      INSERT INTO votes (user_id, place_id, vote)
      VALUES (${id}, ${body.placeId}, ${vote})
      ON CONFLICT (user_id, place_id)
      DO UPDATE SET vote = EXCLUDED.vote
    `;
  }

  return {};
});
