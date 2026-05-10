import z from "zod/v4"
import { redis } from "./redis"
import { Realtime, InferRealtimeEvents } from "@upstash/realtime"

const message = z.object({
    id: z.string(),
    text: z.string(),
    sender: z.string(),
    roomId: z.string(),
    timestamp: z.number(),
    token: z.string().optional(),
})
export type Message = z.infer<typeof message>

/// their is two event one for chat message and another for destroy room
const schema = {
    chat: {
        message,
        destroy: z.object({
            isDestroyed: z.literal(true) /// Allow only true
        }),
    },
}

export const realtime = new Realtime({ schema, redis })
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>
