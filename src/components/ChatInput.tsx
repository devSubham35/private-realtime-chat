"use client";
import { useRef } from "react";

interface ChatInputProps {
    value: string;
    handleSend: () => void;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ChatInput = ({ value, onChange, handleSend }: ChatInputProps) => {

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const isMobile =
        typeof window !== "undefined" && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        /// mobile → allow normal enter
        if (isMobile) return;

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();

            /// desktop → keep refocus
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    };

    const handleClickSend = () => {
        // Don't blur on mobile to keep keyboard open
        if (isMobile) {
            inputRef.current?.focus();
        }
        
        handleSend();

        /// desktop only refocus after send
        if (!isMobile) {
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    };

    return (
        <div className="w-full absolute bottom-0 lg:bottom-10 left-0 flex items-center justify-center">
            <div className="w-full lg:w-[90%] xl:w-1/2 h-full flex items-end gap-2 bg-zinc-900/60 px-2 lg:px-6 py-3 lg:py-5">

                <textarea
                    ref={inputRef}
                    autoFocus={!isMobile}
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full text-sm lg:text-base border border-zinc-600/80 py-2 px-2
                     bg-zinc-950 outline-none ring-0 focus:ring-0 resize-none 
                     overflow-y-auto no-scrollbar min-h-12 lg:min-h-14 max-h-12 lg:max-h-14"
                    onInput={(e) => {
                        const el = e.currentTarget;
                        el.style.height = "auto";
                        el.style.height = el.scrollHeight + "px";
                    }}
                />

                <button
                    onClick={handleClickSend}
                    onTouchStart={(e) => {
                        /// Prevent default touch behavior that might blur the input
                        if (isMobile) {
                            e.preventDefault();
                            handleClickSend();
                        }
                    }}
                    className="px-4 lg:px-10 py-1.5 bg-zinc-500/50 hover:bg-zinc-500/40 font-semibold 
                    cursor-pointer active:scale-95 transition-transform text-sm lg:text-base h-12 lg:h-14"
                >
                    SEND
                </button>

            </div>
        </div>
    );
};

export default ChatInput;