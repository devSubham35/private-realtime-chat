"use client"

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const Providers = ({ children }: { children: React.ReactNode }) => {

    /// Create a query client
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default Providers
