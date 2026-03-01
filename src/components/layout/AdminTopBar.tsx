'use client'

import { Bell, Search, ChevronDown, ShieldAlert, Menu } from 'lucide-react'

export default function AdminTopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
    return (
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 w-full border-b border-gray-100">

            {/* Mobile Menu & Search Bar */}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <button
                    onClick={onMenuToggle}
                    className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-xl lg:hidden shrink-0"
                >
                    <Menu size={24} strokeWidth={2.5} />
                </button>

                <div className="relative group flex-1 hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border-none rounded-2xl bg-gray-50 text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                        placeholder="Search for users, entities, or settings..."
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6 ml-6">

                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-50">
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                    <Bell size={20} strokeWidth={2.5} />
                </button>

                {/* Warning Badge */}
                <div className="hidden lg:flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg border border-amber-100 text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert size={14} />
                    Admin Mode
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 cursor-pointer group pl-4 border-l border-gray-100">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-900 leading-tight">Admin User</p>
                        <p className="text-xs font-medium text-gray-500">System Admin</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm group-hover:border-indigo-100 transition-colors">
                        <span className="text-indigo-700 font-bold text-sm">AD</span>
                    </div>
                    <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
                </div>

            </div>
        </header>
    )
}
