import { env } from "node:process";

export default defineEventHandler(async (event) => {
    return env.BUCKET_URL
});
