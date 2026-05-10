"use client"

import { useState } from "react";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
import { handleGetUsername } from "@/lib/helper";
import { useMutation } from "@tanstack/react-query";
import type { ApiResponseType } from "@/lib/ApiResponse";

const useCreateRoom = () => {

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
        router.push(`/room/${data?.data?.roomId}`)
      }
    }
  })


  return {
    username, 
    createRoomMutate,
    isRoomCreatepending,
  }
}

export default useCreateRoom
