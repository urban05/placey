import { UUID } from "crypto";
import { H3Event } from "#imports";

export function checkAuth(event: H3Event<globalThis.EventHandlerRequest>): UUID | null {
    const authHeader = getHeader(event, "authorization")
    if (!authHeader) throw "No Authorization header"

    const token = authHeader.replace('Bearer ', '')

    const id = verify(token) as UUID | null;
    if (!id) throw "token invalid"
    return id
}
