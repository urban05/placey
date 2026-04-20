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
    SELECT id, name, icon, verified, address, description, ST_Y(cords::geometry) AS latitude, ST_X(cords::geometry) AS longitude, image
    FROM places
    WHERE name ILIKE ${`%${query.q}%`}
    ORDER BY ST_Distance(cords::geography, ST_MakePoint(${query.longitude}, ${query.latitude})) ASC
    LIMIT ${maxResults}
  `;
  return result;
});
