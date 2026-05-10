"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

const NOTIFICATION_MESSAGES: Record<string, { title: string; description: string }> = {
    destroyed: {
        title: "ROOM DESTROYED",
        description: "All messages permanently deleted",
    },
    "room-not-found": {
        title: "ROOM NOT FOUND",
        description: "The room you tried to join does not exist",
    },
    "room-full": {
        title: "ROOM FULL",
        description: "This room has reached its maximum capacity",
    },
};

const NotificationContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [dismissed, setDismissed] = useState(false);

    const destroyed = searchParams.get("destroyed");
    const error = searchParams.get("error");

    const key = destroyed === "true" ? "destroyed" : error ?? null;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDismissed(false);
    }, [key]);

    if (!key || dismissed) return null;

    const message = NOTIFICATION_MESSAGES[key];
    if (!message) return null;

    const handleClose = () => {
        setDismissed(true);
        router.replace(pathname);
    };

    return (
        <div className="w-[90%] lg:w-lg min-h-20 border border-red-950 bg-red-500/10 space-y-2 p-5 lg:p-6
            flex flex-col justify-center items-center relative">
            <button
                onClick={handleClose}
                aria-label="Dismiss notification"
                className="absolute top-2 right-2 p-1 text-red-800 hover:text-red-500 cursor-pointer transition-colors">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
            <h1 className="text-red-800">{message.title}</h1>
            <h1 className="text-red-400/40 text-sm">{message.description}</h1>
        </div>
    );
};

const Notification = () => (
    <Suspense fallback={null}>
        <NotificationContent />
    </Suspense>
);

export default Notification;
