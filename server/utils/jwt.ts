import jwt from "jsonwebtoken"

if (!process.env.TOKEN_SECRET) {
    throw createError("Missing `TOKEN_SECRET` environment variable");
}
const SECRET = process.env.TOKEN_SECRET

export function sign(payload: any) {
    return jwt.sign(payload, SECRET)
}

export function verify(token: string) {
    return jwt.verify(token, SECRET)
}
