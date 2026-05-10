"use client";

import { useState } from "react";
import { formatTimeRemaining } from "@/lib/helper";

interface ChatHeaderProps {
    roomId: string,
    isLoading?: boolean,
    timeRemaining: number | null,
    handleDestroyRoom: () => void,
}

const ChatHeader = ({ roomId, timeRemaining, handleDestroyRoom, isLoading }: ChatHeaderProps) => {

    const [copyText, setCopyText] = useState<string>("COPY");


    /// to copy the room link
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/room/${roomId}`);
            setCopyText("COPIED!");
            setTimeout(() => setCopyText("COPY"), 1500);
        } catch (err) {
            console.error("Clipboard error:", err);
        }
    };

    return (
        <div className="
            w-full border-b border-zinc-700 bg-zinc-900/60 
            flex flex-col lg:flex-row lg:items-center lg:justify-between 
            px-4 sm:px-6 md:px-10 lg:px-16 py-4 gap-4 lg:gap-0
        ">
            {/* ROOM ID */}
            <div className="lg:w-100">
                <h4 className="text-zinc-500 text-sm sm:text-base">Room ID</h4>
                <div className="flex items-center gap-2">
                    <h4 className="text-green-500 text-[14px] sm:text-[16px] break-all whitespace-nowrap">
                        {roomId}
                    </h4>
                    <button
                        onClick={handleCopy}
                        className={`
                                px-2 sm:px-3 py-1 font-semibold cursor-pointer
                                text-[10px] sm:text-[12px] rounded-lg active:scale-95
                                transition-all duration-200 bg-zinc-500/50 hover:bg-zinc-500/40
                                ${copyText === "COPIED!" ? "text-green-500" : ""}`}
                    >
                        {copyText}
                    </button>
                </div>
            </div>

            <div className="hidden lg:block w-0.5 h-10 bg-zinc-500/50 mx-8" />

            <div className="flex items-center justify-between w-full">
                <div>
                    <h4 className="text-zinc-500 text-sm sm:text-base">Self_Destruct_in</h4>
                    <h4 className={`
                    text-[14px] sm:text-[16px] 
                    ${timeRemaining !== null && Number(timeRemaining) < 60 ? "text-red-500" : "text-yellow-500"}
                    `}>
                        {timeRemaining ? formatTimeRemaining(timeRemaining) : "_ _:_ _"}
                    </h4>
                </div>

                <button
                    onClick={handleDestroyRoom}
                    className="w-fit sm:w-auto px-4 py-2.5 bg-zinc-800 rounded-lg text-red-500
                text-sm hover:bg-red-600 hover:text-white cursor-pointer active:scale-95 transition-colors whitespace-nowrap disabled:bg-white/20"
                >
                    {isLoading ? "💣 DESTROYING..." : "💣 DESTROY NOW"}
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
