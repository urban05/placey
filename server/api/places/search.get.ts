import { usePostgres } from "../../utils/postgres";
import { Place } from "@@/shared/place.type";

export default defineEventHandler(async (event) => {
  const maxResults = 50;

  const query: {
    q: string;
    latitude: number;
    longitude: number;
  } = await getQuery(event);

  const sql = usePostgres();
  const result: Place[] = await sql`
    SELECT p.id, p.name, p.icon, p.verified, p.address, p.description, ST_Y(p.cords::geometry) AS latitude, ST_X(p.cords::geometry) AS longitude, p.image, COALESCE(SUM(v.vote), 0) AS votes
    FROM places p
    LEFT JOIN votes v
    ON p.id = v.place_id
    WHERE name ILIKE ${`%${query.q}%`}
    GROUP BY p.id
    ORDER BY ST_Distance(cords::geography, ST_MakePoint(${query.longitude}, ${query.latitude})) ASC
    LIMIT ${maxResults}
  `;
  return result;
});
