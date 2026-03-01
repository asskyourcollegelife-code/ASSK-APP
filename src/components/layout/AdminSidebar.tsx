'use client'

import Link from 'next/link'
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
    ShieldCheck,
    Ticket,
    X
} from 'lucide-react'

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Notes Oversight', href: '/admin/notes', icon: BookOpen },
    { name: 'Timetable', href: '/admin/timetable', icon: Calendar },
    { name: 'Exams', href: '/admin/exams', icon: GraduationCap },
    { name: 'Events', href: '/admin/events', icon: Ticket },
    { name: 'Clubs', href: '/admin/clubs', icon: Users },
    { name: 'Placements', href: '/admin/placements', icon: Briefcase },
]

export default function AdminSidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-slate-900/60 z-20 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            <div className={`w-64 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 flex flex-col pt-6 pb-4 px-4 shadow-2xl lg:shadow-xl z-30 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                {/* Brand */}
                <div className="flex items-center justify-between px-2 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                            <ShieldCheck size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-white leading-none tracking-tight">ASSK</h1>
                            <p className="text-xs text-indigo-300 font-medium">Admin Control</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 lg:hidden text-slate-400 hover:bg-slate-800 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Main Nav */}
                <nav className="flex-1 overflow-y-auto space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href)

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Nav */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                    <Link
                        href="/student/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-500 hover:bg-slate-800 hover:text-white"
                    >
                        Return to Portal
                    </Link>
                </div>
            </div>
        </>
    )
}
