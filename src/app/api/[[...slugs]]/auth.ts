import Elysia from "elysia";
import { redis } from "@/lib/redis";
import { ApiResponse } from "@/lib/ApiResponse";

export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthError";
    }
}

export const authMiddleware = new Elysia({ name: "auth" })
    .error({ AuthError })
    .onError(({ code, set }) => {
        if (code === "AuthError") {
            set.status = 401
            return ApiResponse(401, "Unauthorized")
        }
    })
    .derive(
        { as: "scoped" },
        async ({ query, cookie }) => {

            const roomId = query?.roomId
            const token = cookie[process.env.AUTH_TOKEN_KEY!]?.value as string | undefined

            if (!roomId || !token) {
                throw new AuthError("Missing token or room id")
            }

            const roomName = `meta:${roomId}`

            /// from the room only extract the connected property:  ["fewgtwgt", "Gergyrt"]
            const connctedUsers = await redis.hget<string[]>(roomName, "connected")

            /// Prevented unauthorized room access for invalid user tokens
            if (!connctedUsers?.includes(token)) {
                throw new AuthError("Invalid token")
            }

            return {
                auth: {
                    token,
                    roomId,
                    connctedUsers,
                }
            }
        }
    )