import { usePostgres } from "../utils/postgres";

export default defineEventHandler(async (event) => {
    const body: {
        name: string,
        cords: { latitude: number, longitude: number },
        icon: string,
        verified: number
    } = await readBody(event);
    console.log(body)

    const sql = usePostgres();
    await sql`
        INSERT INTO places (id, name, cords, icon, verified) VALUES (
            gen_random_uuid(),
            ${body.name},
            ST_MakePoint(${body.cords.longitude}, ${body.cords.latitude}),
            ${body.icon},
            ${body.verified})`;
});