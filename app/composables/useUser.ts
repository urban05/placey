import type { UUID } from "crypto"

export function useUser() {
  return useCookie<null | {
    id: UUID;
    email: string;
    username: string;
    token: string;
  }>("user", { default: () => null })
}
