'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, ChevronDown, Menu, Moon, Sun } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function TopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
    const supabase = createClient()
    const [profile, setProfile] = useState<{ full_name: string | null, department: string | null } | null>(null)
    const [isDark, setIsDark] = useState(false)

    // Load saved theme preference
    useEffect(() => {
        const saved = localStorage.getItem('theme')
        if (saved === 'dark') {
            setIsDark(true)
            document.documentElement.classList.add('dark')
        }
    }, [])

    const toggleDarkMode = () => {
        const newDark = !isDark
        setIsDark(newDark)
        if (newDark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('full_name, department')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setProfile(data)
                }
            }
        }

        fetchProfile()
    }, [supabase])

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    }

    return (
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 w-full transition-colors duration-300">

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
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border-none rounded-2xl bg-gray-50 text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:bg-white transition-all"
                        placeholder="Search for courses, notes, or events..."
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-6">

                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="relative p-2.5 rounded-full transition-all duration-300 hover:scale-110"
                    style={{
                        background: isDark
                            ? 'linear-gradient(135deg, #1e293b, #334155)'
                            : 'linear-gradient(135deg, #fef3c7, #fde68a)',
                        boxShadow: isDark
                            ? '0 0 12px rgba(99, 102, 241, 0.3)'
                            : '0 0 12px rgba(251, 191, 36, 0.3)',
                    }}
                    aria-label="Toggle dark mode"
                >
                    {isDark ? (
                        <Sun size={18} className="text-yellow-300" strokeWidth={2.5} />
                    ) : (
                        <Moon size={18} className="text-amber-700" strokeWidth={2.5} />
                    )}
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-50">
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                    <Bell size={20} strokeWidth={2.5} />
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 cursor-pointer group pl-4 border-l border-gray-100">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                            {profile?.full_name || 'Loading...'}
                        </p>
                        <p className="text-xs font-medium text-gray-500">
                            {profile?.department || 'Student'}
                        </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm group-hover:border-primary-100 transition-colors">
                        <span className="text-primary-700 font-bold text-sm">
                            {getInitials(profile?.full_name)}
                        </span>
                    </div>
                    <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
                </div>

            </div>
        </header>
    )
}
