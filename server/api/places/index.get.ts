import { usePostgres } from "../../utils/postgres";
import { Place } from "@@/shared/place.type";

export default defineEventHandler(async (event) => {
  const distance = 10000;

  const query: {
    latitude: number;
    longitude: number;
  } = await getQuery(event);

  const sql = usePostgres();
  const result: Place[] = await sql`
    SELECT p.id, p.name, p.icon, p.verified, p.address, p.description, ST_Y(p.cords::geometry) AS latitude, ST_X(p.cords::geometry) AS longitude, p.image, COALESCE(SUM(v.vote), 0) AS votes
    FROM places p
    LEFT JOIN votes v
    ON p.id = v.place_id
    WHERE ST_DWithin(cords::geography, ST_MakePoint(${query.longitude}, ${query.latitude}), ${distance})
    GROUP BY p.id
  `;
  return result;
});
