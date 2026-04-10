import { usePostgres } from "../../utils/postgres";

export default defineEventHandler(async (event) => {
    const body: {
        id: number,
        name: string,
        cords: {latitude: number, longlitude: number},
        icon: string,
        verified: number
    } = await readBody(event);

    const sql = usePostgres();
    await sql`
        UPDATE places
        SET
            name = ${body.name},
            cords = ST_MakePoint(${body.cords.latitude}, ${body.cords.longlitude}),
            icon = ${body.icon},
            verified = ${body.verified}
        WHERE id = ${body.id}`;
});