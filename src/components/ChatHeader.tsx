"use client";

import { useState } from "react";

const ChatHeader = () => {

    const [roomId] = useState<string>("sample-room");
    const [copyText, setCopyText] = useState<string>("COPY");

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`http://localhost:3000/chat-room/${roomId}`);
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
            <div>
                <h4 className="text-zinc-500 text-sm sm:text-base">Room ID</h4>
                <div className="flex items-center gap-2">
                    <h4 className="text-green-500 text-[14px] sm:text-[16px] break-all whitespace-nowrap">
                        {roomId}
                    </h4>
                    <button
                        onClick={handleCopy}
                        className="
                                px-3 sm:px-4 py-1.5 bg-zinc-500/50 hover:bg-zinc-500/40 
                                font-semibold cursor-pointer text-[11px] sm:text-[12px] 
                                rounded-lg active:scale-95 transition-transform
                                "
                    >
                        {copyText}
                    </button>
                </div>
            </div>

            <div className="hidden lg:block w-0.5 h-10 bg-zinc-500/50 mx-8" />

            <div className="flex items-center justify-between w-full">
                <div>
                    <h4 className="text-zinc-500 text-sm sm:text-base">Self_Destruct</h4>
                    <h4 className="text-yellow-500 text-[14px] sm:text-[16px]">
                        02:00
                    </h4>
                </div>

                <button
                    className="w-fit sm:w-auto px-4 py-2.5 bg-zinc-800 rounded-lg text-red-500
                text-sm hover:bg-zinc-800/80 cursor-pointer active:scale-95 transition-transform whitespace-nowrap disabled:bg-white/20"
                >
                    {`💣 DESTROY NOW`}
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
