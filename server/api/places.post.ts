import { usePostgres } from "../utils/postgres";

export default defineEventHandler(async (event) => {
    const body: {
        name: string,
        cords: {latitude: number, longlitude: number},
        icon: string,
        verified: number
    } = await readBody(event);
    console.log(body)

    const sql = usePostgres();
    await sql`
        INSERT INTO places (id, name, cords, icon, verified) VALUES (
            gen_random_uuid(),
            ${body.name},
            ST_MakePoint(${body.cords.latitude}, ${body.cords.longlitude}),
            ${body.icon},
            ${body.verified})`;
});