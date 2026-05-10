import z from 'zod'
import { Elysia } from 'elysia'
import { nanoid } from 'nanoid'
import { redis } from '@/lib/redis'
import { authMiddleware } from './auth'
import { ApiError } from '@/lib/ApiError'
import { ApiResponse } from '@/lib/ApiResponse'
import { Message, realtime } from '@/lib/realtime'

const ROOM_TTL_SECONDS = 60 * 10

const rooms = new Elysia({ prefix: '/room' })

    ///////////////////////////////////
    /// CREATE ROOM API
    ///////////////////////////////////

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
    /// FETCH THE ROOM TTL API
    ///////////////////////////////////

    .use(authMiddleware)
    .get("/ttl", async ({ auth }) => {
        const room_ttl = await redis.ttl(`meta:${auth.roomId}`)
        return { ttl: room_ttl > 0 ? room_ttl : 0 }
    },
        {
            query: z.object({
                roomId: z.string()
            })
        }
    )

    ///////////////////////////////////
    /// FETCH THE ROOM TTL API
    ///////////////////////////////////

    .delete("/destroy", async ({ auth }) => {
        const roomName = `meta:${auth.roomId}`
        const messageHistory = `messages:${auth.roomId}`
        
        await realtime.channel(auth.roomId).emit("chat.destroy", { isDestroyed: true })

        await Promise.all([
            redis.del(roomName),
            redis.del(auth.roomId),
            redis.del(messageHistory)
        ])

    },
        {
            query: z.object({
                roomId: z.string()
            })
        }
    )

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////


const messages = new Elysia({ prefix: '/messages' })

    ///////////////////////////////////
    /// SEND MESSAGE API
    ///////////////////////////////////
    .use(authMiddleware)
    .post("/send", async ({ auth, body }) => {

        const { roomId, token } = auth
        const { sender, text } = body

        const roomName = `meta:${roomId}`
        const existingRoom = await redis.exists(roomName)

        if (!existingRoom) {
            return new ApiError("Room does not esist", 400)
        }

        const payloadMessage: Message = {
            id: nanoid(),
            text,
            sender,
            roomId,
            timestamp: Date.now()
        }

        const messageHistory = `messages:${roomId}`

        /// push the message into history array
        await redis.rpush(messageHistory, {
            ...payloadMessage,
            token,
        })

        /// Send the message into channel
        await realtime.channel(roomId).emit("chat.message", payloadMessage)

        /// get the remaining time
        const remainingTime = await redis.ttl(roomName)

        await Promise.all([
            redis.expire(roomId, remainingTime),
            redis.expire(roomName, remainingTime),
            redis.expire(messageHistory, remainingTime)
        ])
    },
        {
            query: z.object({
                roomId: z.string(),
            }),
            body: z.object({
                text: z.string().max(1000),
                sender: z.string().max(100),
            })
        }
    )

    ///////////////////////////////////
    /// GET MESSAGE API
    ///////////////////////////////////

    .get("/", async ({ auth }) => {

        const { roomId, token } = auth
        const messageHistory = `messages:${roomId}`

        const messages = await redis.lrange<Message>(messageHistory, 0, -1)

        const formatMessage = messages.map((msg) => {
            return {
                ...msg,
                token: msg.token === token ? token : undefined
            }
        })
        console.log(formatMessage, "++66")

        return {
            messages: formatMessage
        }
    },
        {
            query: z.object({
                roomId: z.string(),
            })
        }
    )

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
export const DELETE = app.fetch
