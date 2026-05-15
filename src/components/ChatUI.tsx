"use client";

import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import useRoom from "@/hooks/useRoom";
import ChatHeader from "./ChatHeader";
import ChatSection from "./ChatSection";

const ChatUI = () => {

    const {
        value,
        chats,
        roomId,
        setValue,
        timeRemaining,
        destroyRoomMutate,
        handleSendMessage,
        isRoomCreatepending,
        isDestroyRoomPending,
    } = useRoom()

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        const sync = () => {
            const el = containerRef.current;
            if (!el) return;
            el.style.height = `${vv.height}px`;
        };

        sync();
        vv.addEventListener("resize", sync);
        return () => {
            vv.removeEventListener("resize", sync);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden"
        >

            <ChatHeader
                roomId={roomId}
                timeRemaining={timeRemaining}
                isLoading={isDestroyRoomPending}
                handleDestroyRoom={()=> destroyRoomMutate()}
            />

            <div className="w-full flex-1 min-h-0 flex justify-center items-center overflow-hidden">
                <ChatSection chats={chats} />
            </div>

            <ChatInput
                value={value}
                handleSend={handleSendMessage}
                isLoading={isRoomCreatepending}
                onChange={(e) => setValue(e.target.value)}
            />

            <>
                <div
                    className="absolute inset-0 -z-10"
                    style={{
                        background:
                            "repeating-linear-gradient(45deg, #000 0px, #111 2px, #000 4px, #222 6px)",
                    }}
                />

                <div
                    className="absolute inset-0 -z-10 pointer-events-none"
                    style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        backdropFilter: "blur(45px) grayscale(20%)",
                        WebkitBackdropFilter: "blur(45px) grayscale(20%)",
                    }}
                />
            </>

        </div>
    );
};

export default ChatUI;
