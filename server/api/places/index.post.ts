import { randomUUID } from "node:crypto";
import { checkAuth } from "../../utils/auth";
import { usePostgres } from "../../utils/postgres";
import { useS3 } from "~~/server/utils/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export default defineEventHandler(async (event) => {
    const userId = checkAuth(event);

    const body: {
        name: string;
        latitude: number;
        longitude: number;
        icon: string;
        address: string;
        description: string;
        image: string;
    } = await readBody(event);

    // choose id for new place
    const id = randomUUID();

    // save image to objectstorage
    const match = body.image.match(
        /^data:(image\/([a-zA-Z0-9+]+));base64,(.+)$/
    );

    if (!match) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid image format",
        });
    }

    const mimeType = match[1];
    const ext = match[2];
    const buffer = Buffer.from(match[3]!, "base64");

    const filename = `${id}.${ext}`;

    const s3 = useS3();

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: filename,
            Body: buffer,
            ContentType: mimeType,
        })
    );

    // insert into db
    const sql = usePostgres();

    const result = await sql`
      INSERT INTO places (id, name, cords, icon, verified, address, description, image)
      VALUES (${id}, ${body.name}, ST_MakePoint (${body.longitude}, ${body.latitude}), ${body.icon}, false, ${body.address}, ${body.description}, ${filename})
    `;

    return result
});
