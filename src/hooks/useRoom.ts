"use client"

import { client } from "@/lib/client";
import { Message } from "@/lib/realtime";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCreateRoom from "./useCreateRoom";
import { useRealtime } from "@/lib/realtime-client";
import { useMutation, useQuery } from "@tanstack/react-query";

const useRoom = () => {

    const router = useRouter()
    const params = useParams()
    const { username } = useCreateRoom()

    const roomId = params?.roomId as string

    const [value, setValue] = useState("");
    const [chats, setChats] = useState<Message[] | []>([]);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(0);

    /// get messages
    const { data: chatList, isLoading: isChatListLoading, refetch: refetchChatList } = useQuery({
        queryKey: ["get-message", roomId],
        queryFn: async () => {
            const res = await client.messages.get({ query: { roomId } })
            return res.data
        }
    })

    /// get room ttl
    const { data: ttlData } = useQuery({
        queryKey: ["room-ttl", roomId],
        queryFn: async () => {
            const res = await client.room.ttl.get({ query: { roomId } })
            return res.data
        }
    })

    /// Create room mutation
    const { mutate: sendMessageMutate, isPending: isRoomCreatepending } = useMutation({
        mutationKey: ["send-message"],
        mutationFn: async (text: string) => {
            await client.messages.send.post({
                text,
                sender: username
            },
                {
                    query: { roomId }
                }
            )
            setValue("");
        }
    })

    /// destroy room mutation
    const { mutate: destroyRoomMutate, isPending: isDestroyRoomPending } = useMutation({
        mutationKey: ["destroy-room"],
        mutationFn: async () => {
            await client.room.destroy.delete(null, { 
                query: { roomId }
            })
        }
    })

    const handleSendMessage = () => {
        if (!value.trim()) return;
        sendMessageMutate(value)
    };


    ////////////////////////////////////////
    /// Realtime chat feature
    ////////////////////////////////////////

    useRealtime({
        channels: [roomId],
        events: ["chat.message", "chat.destroy"],
        onData: ({ event }) => {
            if (event === "chat.message") {
                refetchChatList()
            }

            if (event === "chat.destroy") {
                router.replace("/?destroyed=true")
            }
        }
    })

    ////////////////////////////////////////
    /// Load the messages
    ////////////////////////////////////////

    useEffect(() => {
        function loadChats() {
            if (chatList?.messages?.length) {
                setChats(chatList?.messages)
            }
        }

        loadChats()
    }, [chatList?.messages]);

    ////////////////////////////////////////
    /// get TTL time
    ////////////////////////////////////////

    useEffect(() => {
        if (ttlData?.ttl !== undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTimeRemaining(ttlData?.ttl)
        }
    }, [ttlData]);

    ////////////////////////////////////////
    /// Live timing logic
    ////////////////////////////////////////

    useEffect(() => {

        if (timeRemaining === null || timeRemaining < 0) return

        // if (timeRemaining === 0) {
        //     router.replace("/?destroyed=true")
        // }

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [timeRemaining, router]);


    return {
        value,
        chats,
        roomId,
        setValue,
        timeRemaining,
        destroyRoomMutate,
        handleSendMessage,
        isChatListLoading,
        isRoomCreatepending,
        isDestroyRoomPending,
    }
}

export default useRoom
