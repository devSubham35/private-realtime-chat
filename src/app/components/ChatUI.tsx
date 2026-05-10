"use client";

import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import ChatSection from "./ChatSection";

const ChatUI = () => {

    const [value, setValue] = useState("");
    const [chats, setChats] = useState(Array.from({ length: 25 }, () => "Hey Bro what's up, what are you doing right now bro!"));

    const handleSend = () => {
        if (!value.trim()) return;
        setChats((prev) => [...prev, value]);
        setValue("");
    };

    return (
        <div className="w-full h-screen relative z-50">

            <ChatHeader />

            <div className="w-full h-[calc(100vh-205px)] lg:h-[calc(100vh-225px)] flex justify-center items-center overflow-hidden">
                <ChatSection chats={chats} />
            </div>

            <ChatInput
                value={value}
                handleSend={handleSend}
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
