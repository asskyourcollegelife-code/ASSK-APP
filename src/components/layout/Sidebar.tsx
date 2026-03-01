'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Megaphone,
    BookOpen,
    Calendar,
    GraduationCap,
    Users,
    Briefcase,
    Settings,
    Ticket,
    X
} from 'lucide-react'

const navItems = [
    { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Announcements', href: '/student/announcements', icon: Megaphone },
    { name: 'Notes', href: '/student/notes', icon: BookOpen },
    { name: 'Timetable', href: '/student/timetable', icon: Calendar },
    { name: 'Exams', href: '/student/exams', icon: GraduationCap },
    { name: 'Events', href: '/student/events', icon: Ticket },
    { name: 'Clubs', href: '/student/clubs', icon: Users },
    { name: 'Placements', href: '/student/placements', icon: Briefcase },
]

export default function Sidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            <div className={`sidebar-wrapper w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col pt-6 pb-4 px-4 shadow-xl lg:shadow-sm z-30 transition-all duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                {/* Brand */}
                <div className="flex items-center justify-between px-2 mb-8">
                    <div className="flex items-center">
                        <Image
                            src="/sidebarlogo.png"
                            alt="ASSK - Your College Life Portal"
                            width={160}
                            height={60}
                            className="object-contain"
                            priority
                        />
                    </div>
                    <button onClick={onClose} className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Main Nav */}
                <nav className="flex-1 overflow-y-auto space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                                    }`}
                            >
                                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Settings / Bottom Nav */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                        href="/student/settings"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${pathname === '/student/settings'
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                            : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                            }`}
                    >
                        <Settings size={18} strokeWidth={pathname === '/student/settings' ? 2.5 : 2} />
                        Settings
                    </Link>
                </div>

            </div>
        </>
    )
}
