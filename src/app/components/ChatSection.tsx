import { useEffect, useRef } from 'react'

const ChatSection = ({ chats }: { chats: string[] }) => {

    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        /// Use scrollTo instead of scrollIntoView to avoid focus issues
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chats]);


    return (
        <div 
            ref={containerRef}
            className="w-[90%] xl:w-1/2 h-full flex flex-col gap-4 py-1 lg:py-5 overflow-y-scroll scrollbar-hide pt-3 lg:pt-5 pr-1"
        >
            {chats.map((msg, index) => (
                <div
                    key={index}
                    className="
                        rounded-lg rounded-tl-none odd:rounded-tr-none px-3 py-2 
                        w-fit max-w-[70%] lg:max-w-[50%] flex odd:self-end flex-col backdrop-blur-sm bg-white/5 border border-white/10
                        text-sm lg:text-base wrap-break-word
                    "
                >
                    <h1 className={`${ index % 2 === 0 ? "text-green-500" : "text-yellow-500"} text-xs mb-1.5`}>fox_c-RWaa-lN-kr7AgF7TwR</h1>
                    <h1 className="text-white">{msg}</h1>
                    <p className="mt-0.5 text-xs lg:text-xs text-zinc-400 self-end">
                        09:05am
                    </p>
                </div>
            ))}

            <div ref={chatEndRef} />
        </div>
    )
}

export default ChatSection