import z from 'zod'
import { Elysia } from 'elysia'
import { nanoid } from 'nanoid'
import { redis } from '@/lib/redis'
import { authMiddleware } from './auth'
import { ApiError } from '@/lib/ApiError'
import { ApiResponse } from '@/lib/ApiResponse'

const ROOM_TTL_SECONDS = 60 * 10

///////////////////////////////////
/// CREATE ROOM API
///////////////////////////////////

const rooms = new Elysia({ prefix: '/room' })
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

///////////////////////////////////
/// SEND MESSAGE API
///////////////////////////////////

const messages = new Elysia({ prefix: '/messages' })
    .use(authMiddleware)
    .post("/send", async ({ auth, body }) => {

        const { roomId } = auth
        const { sender, text } = body

        const roomName = `meta:${roomId}`

        try {
            const existingRoom = await redis.exists(roomName)

            if (!existingRoom) {
                return new ApiError("Room does not esist", 400)
            }

            await redis.expire(roomName, ROOM_TTL_SECONDS)

            return ApiResponse(200, "Mesage sent Successfully", { sender, text })
        } catch (error) {
            console.log("Redis error: ", error)
            throw new ApiError("Failed to send message", 400)
        }
    },
        {
            query: z.object({
                roomId: z.string(),
            }),
            body: z.object({
                text: z.string().max(1000),
                sender: z.string().max(100),
            })
        })

///////////////////////////////////
/// ROOT API
///////////////////////////////////

const app = new Elysia({ prefix: '/api' })
    .error({ ApiError })
    .onError(({ code, error, status }) => {
        if (code === 'ApiError') {
            return status(error.status, ApiResponse(error.status, error.message))
        }
    })
    .use(rooms)
    .use(messages)

export type App = typeof app

export const GET = app.fetch
export const POST = app.fetch
