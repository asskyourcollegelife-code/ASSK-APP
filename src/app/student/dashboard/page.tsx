import { ArrowRight, Clock, MapPin, Bot, Plus, Calendar as CalendarIcon, FileText, Megaphone, Briefcase } from 'lucide-react'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export default async function DashboardPage() {
    // Force use of Service Role Key to bypass any accidental RLS restrictions
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    )

    // Fetch announcements
    const { data: announcements } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

    // Fetch upcoming classes for today
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const todayName = DAYS[new Date().getDay()]

    const { data: upcomingClasses } = await supabase
        .from('timetable')
        .select('*')
        .eq('day_of_week', todayName)
        .order('start_time', { ascending: true })

    // Fetch latest notes
    const { data: recentNotes } = await supabase
        .from('notes')
        .select('id, title, created_at, note_type')
        .order('created_at', { ascending: false })
        .limit(3)

    // Fetch upcoming events
    const { data: upcomingEvents } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(3)

    // Fetch upcoming placement deadlines
    const { data: upcomingPlacements } = await supabase
        .from('placement_listings')
        .select('*')
        .gte('application_deadline', new Date().toISOString().split('T')[0])
        .order('application_deadline', { ascending: true })
        .limit(3)

    // Fetch upcoming exams
    const { data: upcomingExams } = await supabase
        .from('exams')
        .select('*')
        .gte('exam_date', new Date().toISOString().split('T')[0])
        .order('exam_date', { ascending: true })

    // Helper to format 24h time to 12h AM/PM
    const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':')
        const h = parseInt(hours)
        const ampm = h >= 12 ? 'PM' : 'AM'
        const h12 = h % 12 || 12
        return `${h12}:${minutes} ${ampm}`
    }

    const todayDateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'long' })
    const classesToday = upcomingClasses?.length || 0;
    const examsUpcoming = upcomingExams?.length || 0;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">

            {/* Welcome Banner */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">Welcome to your Dashboard 👋</h1>
                    <p className="text-gray-600 text-base lg:text-lg mb-6 max-w-xl">
                        You have <strong className="text-primary-600 font-bold">{classesToday} classes</strong> today and <strong className="text-primary-600 font-bold">{examsUpcoming} upcoming exams</strong> scheduled.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a href="/student/timetable" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md shadow-primary-500/20">
                            View Full Schedule
                            <ArrowRight size={18} strokeWidth={2.5} />
                        </a>
                        <a href="/student/exams" className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-bold border border-gray-200 transition-colors">
                            View Exams
                        </a>
                    </div>
                </div>

                {/* Progress Widget */}
                <div className="bg-gray-50 rounded-2xl p-5 w-full md:w-auto md:min-w-[280px]">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-gray-500 tracking-wider">TODAY'S ACTIVITY</span>
                        <span className="text-sm font-bold text-primary-600">{classesToday > 0 ? 'Active' : 'Free Day'}</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-primary-500 rounded-full w-full opacity-50"></div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <CalendarIcon size={16} />
                        {todayDateStr}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Column 1: Classes */}
                <div className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm border border-gray-100 flex flex-col h-auto lg:h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Clock className="text-primary-600" size={20} strokeWidth={2.5} />
                            <h2 className="font-bold text-lg text-gray-900">Upcoming Classes</h2>
                        </div>
                        <a href="/student/timetable" className="text-sm font-bold text-primary-600 hover:text-primary-700">See All</a>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {upcomingClasses && upcomingClasses.length > 0 ? (
                            upcomingClasses.map((cls: any) => {
                                // Determine if this class is "active" based on current time
                                const active = false; // Add real time logic here if needed
                                return (
                                    <div key={cls.id} className="flex gap-4 items-start group hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
                                        <div className={`mt-1 flex-shrink-0 w-16 text-center py-2 rounded-xl font-bold text-sm ${active ? 'bg-primary-50 text-primary-700' : 'bg-gray-50 text-gray-500'}`}>
                                            {formatTime(cls.start_time).split(' ')[0]}
                                            <span className="block text-[10px] mt-0.5">{formatTime(cls.start_time).split(' ')[1]}</span>
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="font-bold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors">{cls.course_name}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-medium">
                                                <MapPin size={12} className="text-gray-400" />
                                                {cls.room} • {cls.professor || 'TBA'}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-8">No more classes today.</p>
                        )}
                    </div>
                </div>

                {/* Column 2: Announcements */}
                <div className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm border border-gray-100 flex flex-col h-auto lg:h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Megaphone className="text-primary-600" size={20} strokeWidth={2.5} />
                            <h2 className="font-bold text-lg text-gray-900">Announcements</h2>
                        </div>
                        <a href="/student/announcements" className="text-sm font-bold text-primary-600 hover:text-primary-700">See All</a>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-5 pr-2">
                        {announcements && announcements.length > 0 ? (
                            announcements.map((ann: any, idx: number) => (
                                <div key={ann.id} className="group cursor-pointer">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`h-2 w-2 rounded-full ${ann.category === 'urgent' ? 'bg-red-500' : 'bg-primary-500'}`}></span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${ann.category === 'urgent' ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600'}`}>
                                            {ann.category}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium ml-auto">
                                            {ann?.created_at ? new Date(ann.created_at).toLocaleDateString() : ''}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{ann.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{ann.body}</p>

                                    {/* Add divider except for last item */}
                                    {idx < announcements.length - 1 && <div className="w-full h-px bg-gray-100 mt-4"></div>}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-8">No recent announcements.</p>
                        )}
                    </div>
                </div>

                {/* Column 3: AI Assistant Widget */}
                <div className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm border border-gray-100 flex flex-col h-auto lg:h-[400px] relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-primary-50 opacity-50 pointer-events-none">
                        {/* Visual background bot silhouette */}
                        <Bot size={120} />
                    </div>

                    <div className="relative z-10 flex items-center gap-2 mb-4">
                        <div className="bg-primary-100 p-1.5 rounded-lg text-primary-600">
                            <Bot size={18} strokeWidth={2.5} />
                        </div>
                        <h2 className="font-bold text-lg text-gray-900">AI Assistant</h2>
                    </div>
                    <p className="relative z-10 text-sm font-medium text-gray-500 mb-auto">Get quick help with your studies.</p>

                    <div className="relative z-10 mt-6">
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4 rounded-br-sm inline-block">
                            <p className="text-sm text-gray-700 leading-relaxed font-medium">Hi Alex! Need help summarizing your last lecture or finding a definition?</p>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ask me anything..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors shadow-sm">
                                <ArrowRight size={16} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Quick Notes */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <FileText className="text-primary-600" size={20} strokeWidth={2.5} />
                            <h2 className="font-bold text-lg text-gray-900">Quick Notes</h2>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                            <Plus size={20} strokeWidth={2.5} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {recentNotes && recentNotes.map((note: any) => {
                            // Assign a theme color based on type
                            let iconColor = 'text-blue-500';
                            if (note.note_type === 'question_paper') iconColor = 'text-purple-500';
                            if (note.note_type === 'reference') iconColor = 'text-green-500';
                            if (note.note_type === 'lab') iconColor = 'text-orange-500';

                            return (
                                <a href="/student/notes" key={note.id} className="bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-2xl p-4 transition-all cursor-pointer flex flex-col items-center text-center group">
                                    <div className="bg-white p-3 rounded-xl mb-3 shadow-sm border border-gray-100">
                                        <FileText className={iconColor} size={24} strokeWidth={2} />
                                    </div>
                                    <h4 className="font-bold text-xs text-gray-900 group-hover:text-primary-600 truncate w-full">{note.title}</h4>
                                    <p className="text-[10px] text-gray-500 mt-1 font-medium">
                                        {note?.created_at ? new Date(note.created_at).toLocaleDateString() : ''}
                                    </p>
                                </a>
                            )
                        })}

                        <div className="border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 rounded-2xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center text-center text-gray-500 hover:text-primary-600 group min-h-[120px]">
                            <div className="bg-white group-hover:bg-primary-100 p-2 rounded-full mb-2 shadow-sm border border-gray-100 group-hover:border-primary-200 transition-colors">
                                <Plus size={20} strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-xs">New Note</h4>
                        </div>
                    </div>
                </div>

                {/* Placement Deadlines */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Briefcase className="text-primary-600" size={20} strokeWidth={2.5} />
                            <h2 className="font-bold text-lg text-gray-900">Placement Deadlines</h2>
                        </div>
                        <a href="/student/placements" className="text-sm font-bold text-primary-600 hover:text-primary-700">View Board</a>
                    </div>

                    <div className="space-y-3">
                        {upcomingPlacements && upcomingPlacements.length > 0 ? (
                            upcomingPlacements.map((placement: any) => {
                                const deadlineStr = placement?.application_deadline || new Date().toISOString()
                                const diffTime = Math.abs(new Date(deadlineStr).getTime() - new Date().getTime());
                                const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                const isUrgent = daysLeft <= 3;

                                return (
                                    <a href="/student/placements" key={placement.id} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-3 border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer group">
                                        <div className={`h-10 w-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center font-bold ${isUrgent ? 'text-red-500' : 'text-blue-600'}`}>
                                            {placement?.company_name?.substring(0, 1) || 'C'}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="font-bold text-sm text-gray-900 group-hover:text-primary-600 transition-colors truncate">{placement?.company_name || 'Company'}</h4>
                                            <p className="text-xs text-gray-500 font-medium truncate">{placement.role_title}</p>
                                        </div>
                                        <div className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap ${isUrgent ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-100'}`}>
                                            {daysLeft === 0 ? 'Last Day!' : `${daysLeft} Days Left`}
                                        </div>
                                    </a>
                                )
                            })
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines.</p>
                        )}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="text-primary-600" size={20} strokeWidth={2.5} />
                            <h2 className="font-bold text-lg text-gray-900">Campus Events</h2>
                        </div>
                        <a href="/student/events" className="text-sm font-bold text-primary-600 hover:text-primary-700">See All</a>
                    </div>

                    <div className="space-y-4">
                        {upcomingEvents && upcomingEvents.length > 0 ? (
                            upcomingEvents.map((event: any) => {
                                const eventDateStr = event?.event_date || new Date().toISOString()
                                const eventDate = new Date(eventDateStr)
                                return (
                                    <a href="/student/events" key={event.id} className="flex gap-4 items-start group hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
                                        <div className="flex-shrink-0 w-14 text-center py-2 rounded-xl bg-gray-50 border border-gray-100 font-bold text-sm">
                                            <span className="block text-primary-600 text-xs tracking-widest uppercase mb-0.5">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                                            <span className="text-gray-900 text-lg leading-none">{eventDate.getDate()}</span>
                                        </div>
                                        <div className="pt-1 overflow-hidden">
                                            <h3 className="font-bold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors truncate">{event.title || 'Untitled Event'}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5 font-medium">
                                                <Clock size={12} className="text-gray-400" />
                                                {formatTime(event?.start_time || '')}
                                            </div>
                                        </div>
                                    </a>
                                )
                            })
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-8">No upcoming events.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
