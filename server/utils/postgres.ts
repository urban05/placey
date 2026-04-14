import postgres from "postgres";

var connection = null as ReturnType<typeof postgres> | null;

export function usePostgres() {


  if (!connection) {
    if (!process.env.DATABASE_URL) {
      throw createError("Missing `DATABASE_URL` environment variable");
    }
    connection = postgres(process.env.DATABASE_URL as string, {});
  }

  return connection;
}
