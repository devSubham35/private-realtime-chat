import { nanoid } from "nanoid"
import { redis } from "./lib/redis"
import { NextRequest, NextResponse } from "next/server"

type roomType = {
    connected: string[]
    expireedAt: number
}

const AUTH_TOKEN_KEY = process.env.AUTH_TOKEN_KEY!

export const proxy = async (req: NextRequest) => {

    const pathname = req.nextUrl.pathname
    const roomMatch = pathname.match(/^\/room\/([^/]+)$/)


    if (!roomMatch) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    const roomId = roomMatch?.[1]
    const roomName = `meta:${roomId}`

    /// find the room is valid or not
    const room = await redis.hgetall<roomType>(roomName)

    if (!room || !room.connected) {
        return NextResponse.redirect(new URL("/?error=room-not-found", req.url))
    }

    const response = NextResponse.next()

    /// extract the user token from cookie
    const exisingToken = req.cookies.get(AUTH_TOKEN_KEY)?.value

    //////////////////////////
    /// EXISTING USER ALLOWED TO REJOIN : if user token exist in the room
    //////////////////////////

    if (exisingToken && room.connected.includes(exisingToken)) {
        return response
    }

    //////////////////////////
    /// USER ISN'T ALLOWED TO JOIN : if the room is full
    //////////////////////////

    if (room.connected.length === 2) {
        return NextResponse.redirect(new URL("/?error=room-full", req.url))
    }

    //////////////////////////
    /// ALLOWED TO JOIN : if user isn't inside the room and room is not full
    //////////////////////////

    const token = nanoid()

    /// set the authenticated token
    response.cookies.set(AUTH_TOKEN_KEY, token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    })

    /// Add user token into connected room
    await redis.hset(roomName, {
        connected: [...room?.connected, token]
    })

    ///return the response
    return response
}

export const config = {
    matcher: "/room/:path*"
}