'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminTopBar from '@/components/layout/AdminTopBar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Sidebar */}
            <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full transition-all">
                <AdminTopBar onMenuToggle={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}

