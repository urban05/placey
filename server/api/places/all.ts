import { usePostgres } from "../../utils/postgres";

export default defineEventHandler(async (event) => {
    const sql = usePostgres();
    const result: {
        id: number,
        name: string,
        cords: {latitude: number, longlitude: number},
        icon: string,
        verified: number
    } = await sql`SELECT * FROM places` as any;
    return result;
});