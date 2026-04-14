import { usePostgres } from "../utils/postgres";
import { Place } from "@@/shared/place.type";

export default defineEventHandler(async (event) => {
  const distance = 10000;

  const query: {
    latitude: number;
    longitude: number;
  } = await getQuery(event);

  const sql = usePostgres();
  const result: Place[] = await sql`
        SELECT id, name, icon, verified, address, description, ST_Y(cords::geometry) AS latitude, ST_X(cords::geometry) AS longitude
        FROM places
        WHERE ST_DWithin(cords::geography, ST_MakePoint(${query.longitude}, ${query.latitude}), ${distance})
    `;
  return result;
});
