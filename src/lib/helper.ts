import { nanoid } from "nanoid"

export const STORAGE_KEY = "chat_username"
const ANIMALS = ["wolf", "frog", "shark", "monkey"]

/// generate random user name
export const generateRandomUsername = () => {
    const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
    return `anonymous-${word}-${nanoid()}`
}

/// get the user name
export function handleGetUsername() {
    const existingUsername = localStorage.getItem(STORAGE_KEY)

    if (existingUsername) {
        return existingUsername
    }

    const username = generateRandomUsername()
    localStorage.setItem(STORAGE_KEY, username)
    return username
}

/// format remaining time
export function formatTimeRemaining(seconds: number){
    const mins = Math.floor(seconds/60)
    const secs = seconds % 60

    return `${mins}:${secs.toString().padStart(2, "0")}`
}