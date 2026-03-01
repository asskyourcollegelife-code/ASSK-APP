'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import AIChatWidget from '@/components/chat/AIChatWidget'

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full transition-all">
                <TopBar onMenuToggle={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full">
                    {children}
                </main>
            </div>

            <AIChatWidget />
        </div>
    )
}

