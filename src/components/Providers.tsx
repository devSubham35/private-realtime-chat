"use client"

import React from 'react'
import { RealtimeProvider } from '@upstash/realtime/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const Providers = ({ children }: { children: React.ReactNode }) => {

    /// Create a query client
    const queryClient = new QueryClient()

    return (
        <RealtimeProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </RealtimeProvider>
    )
}

export default Providers
