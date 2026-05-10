"use client"

import { useState } from "react";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
import { handleGetUsername } from "@/lib/helper";
import { useMutation } from "@tanstack/react-query";
import type { ApiResponseType } from "@/lib/ApiResponse";

const useCreateRoom = () => {

  const router = useRouter()
  const [joiningRoomId, setJoiningRoomId] = useState<string>("");
  
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
        router.push(`/room/${data?.data?.roomId}`)
      }
    }
  })

  const handleJoinRoom = () => {
    console.log("hello")
    router.push(`${process.env.NEXT_PUBLIC_APP_URL}/room/${joiningRoomId}`)
  }


  return {
    username,
    joiningRoomId,
    handleJoinRoom,
    createRoomMutate,
    setJoiningRoomId,
    isRoomCreatepending,
  }
}

export default useCreateRoom
