import { createClient } from '@/lib/supabase/server'
import { Users, Megaphone, Calendar, Users2, ShieldCheck, Activity } from 'lucide-react'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Fetch basic stats
    const [{ count: studentCount }, { count: announcementCount }, { count: eventCount }, { count: clubCount }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('announcements').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('clubs').select('*', { count: 'exact', head: true })
    ])

    const stats = [
        { label: 'Total Students', value: studentCount || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Announcements', value: announcementCount || 0, icon: Megaphone, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Active Events', value: eventCount || 0, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Clubs & Societies', value: clubCount || 0, icon: Users2, color: 'text-green-600', bg: 'bg-green-50' },
    ]

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl shrink-0 hidden md:block">
                        <ShieldCheck size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">Admin Control Center</h1>
                        <p className="text-gray-500 font-medium text-sm lg:text-base">Manage users, content, and application settings.</p>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm shadow-indigo-200">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div>
                <div className="flex items-center gap-2 mb-4 px-2">
                    <Activity className="text-indigo-600" size={20} strokeWidth={2.5} />
                    <h2 className="font-bold text-lg text-gray-900">System Overview</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-500 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Placeholder for Quick Actions or Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
                    <h3 className="font-bold text-lg text-gray-900 mb-6">Recent Activity</h3>
                    <div className="flex flex-col items-center justify-center h-full text-center pb-12">
                        <Activity className="text-gray-300 mb-4" size={48} strokeWidth={1.5} />
                        <p className="text-gray-500 font-medium w-3/4 mx-auto">The activity feed mapping to robust audit logs will be connected here.</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
                    <h3 className="font-bold text-lg text-gray-900 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        {/* Quick action buttons */}
                        <a href="/admin/announcements" className="block w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-100 p-4 rounded-2xl transition-colors group">
                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 mb-1">Post Announcement</h4>
                            <p className="text-xs text-gray-500 font-medium">Broadcast a message to all student dashboards.</p>
                        </a>
                        <a href="/admin/events" className="block w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-100 p-4 rounded-2xl transition-colors group">
                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 mb-1">Create Event</h4>
                            <p className="text-xs text-gray-500 font-medium">Add a new campus event or workshop to the calendar.</p>
                        </a>
                        <a href="/admin/placements" className="block w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-100 p-4 rounded-2xl transition-colors group">
                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 mb-1">Add Job Listing</h4>
                            <p className="text-xs text-gray-500 font-medium">Post a new placement or internship opportunity.</p>
                        </a>
                    </div>
                </div>

            </div>

        </div>
    )
}
