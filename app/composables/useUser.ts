import type { UUID } from "crypto"

export function useUser() {
  return useState<null | {
    id: UUID;
    email: string;
    username: string;
    token: string;
  }>("user", () => null)
}
