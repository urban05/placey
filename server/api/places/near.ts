import { usePostgres } from "../../utils/postgres";

export default defineEventHandler(async (event) => {
    const distance = 4000
    const body: {
        latitude: number,
        longlitude: number,
        distance: number
    } = await readBody(event);

    const sql = usePostgres();
    const result = await sql`
        SELECT *, ST_Distance(cords::geography, ST_MakePoint(${body.latitude}, ${body.longlitude})) AS distance
        FROM places
        WHERE ST_DTWithin(cords::geography, ST_MakePoint(${body.latitude}, ${body.longlitude}), ${distance})
    `;
    return result;
});