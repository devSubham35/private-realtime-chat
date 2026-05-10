import { Message } from '@/lib/realtime';
import { useEffect, useRef } from 'react'
import { formatTime } from '@/lib/helper';
import useCreateRoom from '@/hooks/useCreateRoom';

const ChatSection = ({ chats }: { chats?: Message[] }) => {

    const { username } = useCreateRoom();
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
            className="w-[90%] xl:w-1/2 h-full flex flex-col gap-4 py-1 lg:py-5 overflow-y-scroll hide-scrollbar pt-3 lg:pt-5 pr-1"
        >
            {
                chats?.length ?
                    chats?.map((msg, index) => (
                        <div
                            key={index}
                            className={`
                            rounded-lg rounded-tl-none odd:rounded-tr-none px-3 py-2 
                            w-fit max-w-[70%] lg:max-w-[50%] flex flex-col backdrop-blur-sm bg-white/5 border border-white/10
                            text-sm lg:text-base wrap-break-word
                            ${msg?.token ? "self-end" : ""}
                            `}
                        >
                            <h1 className="text-white text-sm">{msg?.text}</h1>
                            <p className="mt-1.5 text-xs lg:text-[10px] text-zinc-400 self-end flex items-center gap-1">
                                {formatTime(msg?.timestamp)} |                             
                                <h1 className={`${msg?.token ? "text-green-500" : "text-yellow-500"} text-[10px] self-end`}>
                                {msg?.sender === username ? "YOU" : msg?.sender}
                            </h1>
                            </p>
                        </div>
                    ))
                    :
                    <div className='w-full h-full flex items-center justify-center text-neutral-600'>
                        <h1>No messages yet, strt the conversation</h1>
                    </div>
            }

            <div ref={chatEndRef} />
        </div>
    )
}

export default ChatSection