import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Calendar as CalendarIcon, Clock, MapPin, User as UserIcon } from 'lucide-react'

// Define the Timetable entry type
type TimetableEntry = {
    id: string;
    course_name: string;
    course_code: string;
    professor: string;
    room: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default async function TimetablePage() {
    // Force use of Service Role Key to bypass any accidental RLS restrictions
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    )

    // Fetch timetable
    // We order by day_of_week and start_time
    const { data: entries, error } = await supabase
        .from('timetable')
        .select('*')
        .order('start_time', { ascending: true })

    if (error) {
        console.error('Error fetching timetable:', error)
    }

    // Helper to format 24h time to 12h AM/PM
    const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        // timeStr format comes as "14:30:00" from Postgres TIME
        const [hours, minutes] = timeStr.split(':')
        const h = parseInt(hours)
        const ampm = h >= 12 ? 'PM' : 'AM'
        const h12 = h % 12 || 12
        return `${h12}:${minutes} ${ampm}`
    }

    // Group entries by day
    const groupedEntries = DAYS.reduce((acc, day) => {
        // day_of_week is text in the DB ("Monday", "Tuesday", etc.)
        acc[day] = entries?.filter((e: TimetableEntry) => e.day_of_week === day) || []
        return acc
    }, {} as Record<string, TimetableEntry[]>)

    // Get the current day of the week text
    const todayIndex = new Date().getDay()
    const mappedDay = todayIndex === 0 ? null : DAYS[todayIndex - 1]

    return (
        <div className="max-w-7xl mx-auto pb-12">

            {/* Header */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 mb-6 lg:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 lg:gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-primary-100 text-primary-600 p-4 rounded-2xl hidden md:block">
                        <CalendarIcon size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">Class Timetable</h1>
                        <p className="text-gray-500 text-sm lg:text-base font-medium">Weekly schedule for Computer Science (Year 3)</p>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex bg-gray-50 p-3 rounded-2xl border border-gray-100 gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-xs font-bold text-gray-600">Theory</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                        <span className="text-xs font-bold text-gray-600">Lab/Practical</span>
                    </div>
                </div>
            </div>

            {/* Grid Layout for Schedule */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

                    {DAYS.map((dayName) => {
                        const dayEntries = groupedEntries[dayName]
                        const isToday = dayName === mappedDay

                        return (
                            <div key={dayName} className={`lg:min-h-[500px] flex flex-col ${isToday ? 'bg-primary-50/30' : ''}`}>

                                {/* Column Header */}
                                <div className={`p-4 text-center border-b border-gray-100 ${isToday ? 'bg-primary-50 border-b-primary-100' : ''}`}>
                                    <h2 className={`font-bold uppercase tracking-wider text-sm ${isToday ? 'text-primary-600' : 'text-gray-500'}`}>
                                        {dayName}
                                    </h2>
                                    {isToday && (
                                        <div className="text-[10px] font-bold text-primary-500 uppercase mt-1">Today</div>
                                    )}
                                </div>

                                {/* Classes List */}
                                <div className="p-3 flex-1 flex flex-col gap-3">
                                    {dayEntries.length > 0 ? (
                                        dayEntries.map((cls) => (
                                            <div
                                                key={cls.id}
                                                className={`p-4 rounded-2xl border bg-blue-50 border-blue-100 relative`}
                                            >
                                                {/* Color Indicator */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-blue-500`}></div>

                                                <h3 className="font-bold text-sm text-gray-900 leading-snug mb-1 pl-2">
                                                    {cls.course_name}
                                                </h3>
                                                <p className="text-[10px] font-bold text-gray-400 pl-2 mb-2 uppercase">{cls.course_code}</p>

                                                <div className="space-y-1.5 pl-2">
                                                    <div className="flex items-start gap-1.5 text-xs text-gray-600 font-medium">
                                                        <Clock size={14} className="mt-0.5 text-gray-400 shrink-0" />
                                                        <span>{formatTime(cls.start_time)} - {formatTime(cls.end_time)}</span>
                                                    </div>

                                                    {cls.room && (
                                                        <div className="flex items-start gap-1.5 text-xs text-gray-600 font-medium z-10">
                                                            <MapPin size={14} className="mt-0.5 text-gray-400 shrink-0" />
                                                            <span>{cls.room}</span>
                                                        </div>
                                                    )}

                                                    {cls.professor && (
                                                        <div className="flex items-start gap-1.5 text-xs text-gray-600 font-medium z-10">
                                                            <UserIcon size={14} className="mt-0.5 text-gray-400 shrink-0" />
                                                            <span className="truncate">{cls.professor}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-2 p-4">
                                            <div className="h-0.5 w-8 bg-gray-200 rounded-full"></div>
                                            <p className="text-xs font-medium">No classes</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>

        </div>
    )
}
