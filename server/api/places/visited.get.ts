import { usePostgres } from "../../utils/postgres";
import { Place } from "@@/shared/place.type";

export default defineEventHandler(async (event) => {
  const userId = checkAuth(event);
  const sql = usePostgres();

  const result: Place[] = await sql`
    SELECT 
      p.id,
      p.name,
      p.icon,
      p.verified,
      p.address,
      p.description,
      ST_Y(p.cords::geometry) AS latitude,
      ST_X(p.cords::geometry) AS longitude,
      p.image,
      COALESCE(SUM(v.vote), 0) AS votes
    FROM places p
    INNER JOIN users_place up
      ON p.id = up.place_id
    LEFT JOIN votes v
      ON p.id = v.place_id
    WHERE up.user_id = ${userId}
    GROUP BY p.id
  `;

  return result;
});