import { S3Client } from '@aws-sdk/client-s3'

var client = null as S3Client | null;

export function useS3() {


    if (!client) {
        if (!process.env.BUCKET_ENDPOINT || !process.env.BUCKET_ACCESS_KEY_ID || !process.env.BUCKET_SECRET_ACCESS_KEY) {
            throw createError("Missing `BUCKET_ENDPOINT`, `BUCKET_ACCESS_KEY_ID`, `BUCKET_SECRET_ACCESS_KEY` environment variable");
        }

        client = new S3Client({
            region: "us-east-1",
            endpoint: process.env.BUCKET_ENDPOINT!,
            forcePathStyle: true,
            credentials: {
                accessKeyId: process.env.BUCKET_ACCESS_KEY_ID!,
                secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY!,
            },
        });
    }

    return client;
}
