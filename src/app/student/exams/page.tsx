import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { GraduationCap, AlertCircle, FileText, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react'

// Define the Exam entry type
type ExamEntry = {
    id: string;
    subject_name: string;
    subject_code: string;
    exam_type: string;
    department: string;
    year: number;
    section: string | null;
    exam_date: string;
    start_time: string;
    duration_mins: number;
    venue: string;
    notes: string | null;
}

export default async function ExamsPage() {
    // Force use of Service Role Key to bypass any accidental RLS restrictions
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    )

    // Fetch upcoming exams ordered by date
    const { data: exams, error } = await supabase
        .from('exams')
        .select('*')
        .gte('exam_date', new Date().toISOString().split('T')[0])
        .order('exam_date', { ascending: true })

    if (error) {
        console.error('Error fetching exams:', error)
    }

    // Helper to format date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })
    }

    // Helper to format time
    const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':')
        const h = parseInt(hours)
        const ampm = h >= 12 ? 'PM' : 'AM'
        const h12 = h % 12 || 12
        return `${h12}:${minutes} ${ampm}`
    }

    // Helper for duration
    const formatDuration = (mins: number) => {
        const h = Math.floor(mins / 60)
        const m = mins % 60
        if (h > 0 && m > 0) return `${h}h ${m}m`
        if (h > 0) return `${h} Hour${h > 1 ? 's' : ''}`
        return `${m} Mins`
    }

    // Helper to get color theme by exam type
    const getTypeTheme = (type: string) => {
        switch (type) {
            case 'internal': return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'external': return 'bg-red-50 text-red-600 border-red-100'
            case 'practical': return 'bg-purple-50 text-purple-600 border-purple-100'
            case 'viva': return 'bg-orange-50 text-orange-600 border-orange-100'
            case 'model': return 'bg-green-50 text-green-600 border-green-100'
            default: return 'bg-gray-50 text-gray-600 border-gray-100'
        }
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-primary-100 text-primary-600 p-4 rounded-2xl shrink-0 hidden md:block">
                        <GraduationCap size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">Examinations</h1>
                        <p className="text-gray-500 font-medium">Track your upcoming tests, practicals, and final exams.</p>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    <button disabled title="Results feature coming soon!" className="bg-white text-gray-400 px-6 py-2.5 rounded-xl font-bold border border-gray-200 flex items-center gap-2 cursor-not-allowed opacity-75">
                        <FileText size={18} strokeWidth={2.5} />
                        Past Results (Soon)
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="space-y-6">

                {/* Section Header */}
                <div className="flex items-center gap-2 mb-4 px-2">
                    <AlertCircle className="text-primary-600" size={20} strokeWidth={2.5} />
                    <h2 className="font-bold text-lg text-gray-900">Upcoming Schedule</h2>
                </div>

                {exams && exams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam: ExamEntry) => {

                            // Calculate days left
                            const diffTime = Math.abs(new Date(exam.exam_date).getTime() - new Date().getTime());
                            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            const isVerySoon = daysLeft <= 3;

                            return (
                                <div key={exam.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col relative overflow-hidden">

                                    {/* Urgency indicator stripe */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${isVerySoon ? 'bg-red-500' : 'bg-primary-500'}`}></div>

                                    {/* Top Row: Date & Type */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900">{formatDate(exam.exam_date)}</span>
                                            <span className={`text-xs font-bold ${isVerySoon ? 'text-red-500' : 'text-primary-600'}`}>
                                                {daysLeft === 0 ? 'Today!' : `In ${daysLeft} days`}
                                            </span>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getTypeTheme(exam.exam_type)}`}>
                                            {exam.exam_type}
                                        </div>
                                    </div>

                                    {/* Subject Details */}
                                    <div className="mb-6">
                                        <h3 className="font-extrabold text-xl text-gray-900 mb-1 leading-tight group-hover:text-primary-600 transition-colors">
                                            {exam.subject_name}
                                        </h3>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                                            {exam.subject_code} • Sec {exam.section}
                                        </p>
                                    </div>

                                    {/* Meta Details Grids */}
                                    <div className="grid grid-cols-2 gap-4 mb-4 flex-1">
                                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase mb-1">
                                                <Clock size={12} /> Time
                                            </div>
                                            <div className="text-sm font-bold text-gray-900">{formatTime(exam.start_time)}</div>
                                            <div className="text-xs font-medium text-gray-500">{formatDuration(exam.duration_mins)}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase mb-1">
                                                <MapPin size={12} /> Venue
                                            </div>
                                            <div className="text-sm font-bold text-gray-900 truncate">{exam.venue}</div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {exam.notes && (
                                        <div className="bg-orange-50 text-orange-700 p-3 rounded-xl text-xs font-medium border border-orange-100 mt-auto">
                                            <span className="font-bold mr-1">Note:</span> {exam.notes}
                                        </div>
                                    )}

                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="w-full py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <GraduationCap size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming exams</h3>
                        <p className="text-gray-500">You have no scheduled internal or external assessments.</p>
                    </div>
                )}
            </div>

        </div>
    )
}
