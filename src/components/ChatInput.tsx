"use client";
import { useRef } from "react";

interface ChatInputProps {
    value: string;
    isLoading?: boolean;
    handleSend: () => void;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ChatInput = ({ value, onChange, handleSend, isLoading }: ChatInputProps) => {

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const isMobile =
        typeof window !== "undefined" && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        /// mobile → allow normal enter (newline)
        if (isMobile) return;

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim().length === 0 || isLoading) return;
            handleSend();
        }
    };

    /// Prevent the button from stealing focus from the textarea so the mobile
    /// keyboard doesn't close between sends.
    const preventFocusSteal = (e: React.SyntheticEvent) => {
        e.preventDefault();
    };

    const handleClickSend = () => {
        if (value.trim().length === 0 || isLoading) return;
        handleSend();
        inputRef.current?.focus();
    };

    return (
        <div className="w-full flex items-center justify-center shrink-0">
            <div className="w-full lg:w-[90%] xl:w-1/2 flex items-end gap-2 bg-zinc-900/60 px-2 lg:px-4 py-3 lg:py-4">

                <textarea
                    ref={inputRef}
                    autoFocus={!isMobile}
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type message..."
                    rows={1}
                    readOnly={isLoading}
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
                    type="button"
                    tabIndex={-1}
                    onMouseDown={preventFocusSteal}
                    onPointerDown={preventFocusSteal}
                    onClick={handleClickSend}
                    disabled={isLoading || value.trim().length === 0}
                    className="px-4 lg:px-10 py-1.5 bg-zinc-500/50 hover:bg-zinc-500/40 font-semibold
                    cursor-pointer active:scale-95 transition-transform text-sm lg:text-base h-12 lg:h-14
                    disabled:bg-zinc-500/20 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                    {isLoading ? "SENDING..." : "SEND"}
                </button>

            </div>
        </div>
    );
};

export default ChatInput;