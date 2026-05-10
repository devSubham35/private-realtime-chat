"use client"

import { useState } from "react";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
import { handleGetUsername } from "@/lib/helper";
import { useMutation } from "@tanstack/react-query";
import type { ApiResponseType } from "@/lib/ApiResponse";

const HomePage = () => {

    const router = useRouter()
    const [username] = useState(() => {
        if (typeof window === "undefined") return ""
        return handleGetUsername()
    })

    /// Create room mutation
    const { mutate: createRoomMutate, isPending: isRoomCreatepending } = useMutation({
        mutationKey: ["create-room"],
        mutationFn: async () => {
            const { data, error } = await client.room.create.post()
            if (error) throw new Error((error.value as ApiResponseType).message)
            return data
        },
        onSuccess: (data) => {
            if (data?.success) {
                router.push(`/chat-room/${data?.data?.roomId}`)
            }
        }
    })

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center gap-8 p-4 lg:p-0 relative">

            <div className="text-center">
                <h1 className="text-green-500 text-[18px] lg:text-xl mb-1">&gt;private_chat</h1>
                <h4 className="text-zinc-500 text-[14px] lg:text-base">A private, self distructive chat room</h4>
            </div>

            <div className="w-[90%] lg:w-lg min-h-20 border border-zinc-600/80 bg-zinc-900 space-y-2 p-5 lg:p-8">
                <h4 className="text-zinc-500 text-[14px] lg:text-base">Your identity</h4>
                <input
                    disabled
                    value={username}
                    className="w-full border border-zinc-600/80 py-3 px-4 bg-zinc-950 text-[14px] lg:text-base disabled:text-zinc-400"
                />
                <button
                    onClick={() => createRoomMutate()}
                    className="w-full py-3 flex justify-center items-center bg-white text-zinc-800 font-bold mt-2
                    cursor-pointer hover:bg-white/80 transition-colors duration-300 text-[14px] lg:text-base disabled:bg-white/20">
                    {isRoomCreatepending ? "CREATING..." : `CREATE SECURE ROOM`}
                </button>

                <div className="my-3 w-full flex items-center text-zinc-600">
                    <div className="w-1/2 h-0.5 border-b border-zinc-700"></div>
                    <span className="mx-3">or</span>
                    <div className="w-1/2 h-0.5 border-b border-zinc-700"></div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-2 tex-[#9f071138]">
                    <input
                        value=""
                        placeholder="Enter room id..."
                        className="w-full border border-zinc-600/80 py-3 px-4 bg-zinc-950 text-[14px] lg:text-base disabled:text-zinc-600"
                    />
                    <button
                        className="w-full lg:w-fit whitespace-nowrap py-2.5 px-4 flex justify-center items-center bg-white text-zinc-800 font-bold
                        cursor-pointer hover:bg-white/80 transition-colors duration-300 text-[14px] lg:text-base disabled:bg-white/20">
                        {`JOIN ROOM`}
                    </button>
                </div>
            </div>
        </div >
    )
}

export default HomePage