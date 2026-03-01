import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Calendar, Plus, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default async function AdminTimetablePage() {
    // Force use of Service Role Key to bypass any accidental RLS restrictions on the newly created tables
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    )

    // Fetch timetable classes ordered by day and start time
    const { data: schedule, error } = await supabase
        .from('timetable')
        .select('*')
        .order('day_of_week')
        .order('start_time')

    // Helper to format 24h to 12h
    const formatTime = (time24: string) => {
        if (!time24) return ''
        const [h, m] = time24.split(':')
        const hours = parseInt(h, 10)
        const suffix = hours >= 12 ? 'PM' : 'AM'
        const hours12 = hours % 12 || 12
        return `${hours12}:${m} ${suffix}`
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    return (
        <div className="max-w-7xl mx-auto pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-teal-100 text-teal-600 p-4 rounded-2xl shrink-0 hidden md:block">
                        <Calendar size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">Class Timetable</h1>
                        <p className="text-gray-500 font-medium text-sm lg:text-base">Manage the weekly master schedule for classes and lectures.</p>
                    </div>
                </div>

                <div className="flex relative z-10 w-full md:w-auto mt-2 md:mt-0">
                    <Link href="/admin/timetable/new" className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2">
                        <Plus size={18} strokeWidth={2.5} />
                        Add Class
                    </Link>
                </div>
            </div>

            {/* Timetable List (Grouped by Day for easier reading by admin) */}
            <div className="space-y-6">
                {days.map(day => {
                    const dayClasses = schedule?.filter(c => c.day_of_week === day) || []

                    if (dayClasses.length === 0) return null

                    return (
                        <div key={day} className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-extrabold text-gray-900 mb-4 px-2">{day}</h2>
                            <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                            <th className="font-bold p-3 rounded-l-xl w-1/4">Time</th>
                                            <th className="font-bold p-3 w-1/3">Course Title</th>
                                            <th className="font-bold p-3">Professor</th>
                                            <th className="font-bold p-3">Room</th>
                                            <th className="font-bold p-3 text-right rounded-r-xl pr-6">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {dayClasses.map(cls => (
                                            <tr key={cls.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="p-3 text-sm font-bold text-gray-700">
                                                    {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                                                </td>
                                                <td className="p-3">
                                                    <p className="text-sm font-bold text-gray-900">{cls.course_name}</p>
                                                    <p className="text-xs text-gray-500 font-medium">{cls.course_code}</p>
                                                </td>
                                                <td className="p-3 text-sm font-medium text-gray-600">
                                                    {cls.professor}
                                                </td>
                                                <td className="p-3 text-sm font-bold text-indigo-600">
                                                    {cls.room}
                                                </td>
                                                <td className="p-3 text-right pr-6">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
                                                            <Edit2 size={16} strokeWidth={2.5} />
                                                        </button>
                                                        <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                                                            <Trash2 size={16} strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                })}

                {(!schedule || schedule.length === 0) && (
                    <div className="bg-white rounded-3xl p-12 text-center text-gray-500 border border-gray-100 shadow-sm">
                        No classes scheduled for the week.
                    </div>
                )}
            </div>

        </div>
    )
}
