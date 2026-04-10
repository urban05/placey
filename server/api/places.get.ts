import { usePostgres } from "../utils/postgres";
import { Place } from "@@/shared/place.type";

export default defineEventHandler(async (event) => {
  const distance = 1000;

  const query: {
    latitude: number;
    longlitude: number;
  } = await getQuery(event);

  const sql = usePostgres();
  const result: Place[] = await sql`
        SELECT id, name, icon, verified, address, description, ST_Y(cords::geometry) AS latitude, ST_X(cords::geometry) AS longtitude
        FROM places
        WHERE ST_DWithin(cords::geography, ST_MakePoint(${query.latitude}, ${query.longlitude}), ${distance})
    `;
  return result;
});
