import postgres from "postgres";

export function usePostgres() {
  if (!process.env.DATABASE_URL) {
    throw createError("Missing `DATABASE_URL` environment variable");
  }

  return postgres(process.env.DATABASE_URL as string, {});
}
