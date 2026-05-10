import { Elysia } from 'elysia'
import { nanoid } from 'nanoid'
import { redis } from '@/lib/redis'
import { ApiError } from '@/lib/ApiError'
import { ApiResponse } from '@/lib/ApiResponse'

const ROOM_TTL_SECONDS = 60 * 10

const rooms = new Elysia({ prefix: '/room' })

    /// CREATE ROOM API
    .post("/create", async () => {
        const roomId = nanoid()
        const roomName = `meta:${roomId}`

        try {
            await redis.hset(roomName, {
                connected: [],
                expiredAt: Date.now()
            })

            await redis.expire(roomName, ROOM_TTL_SECONDS)

            return ApiResponse(200, "Room Created Successfully", { roomId })
        } catch (error) {
            console.log("Redis error: ", error)
            throw new ApiError("Failed to create room", 400)
        }
    })

const app = new Elysia({ prefix: '/api' })
    .error({ ApiError })
    .onError(({ code, error, status }) => {
        if (code === 'ApiError') {
            return status(error.status, ApiResponse(error.status, error.message))
        }
    })
    .use(rooms)

export type App = typeof app

export const GET = app.fetch
export const POST = app.fetch
