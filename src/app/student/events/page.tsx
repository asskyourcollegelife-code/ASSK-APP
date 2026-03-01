import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Calendar, MapPin, Clock, Users, Ticket, Search, Filter, Compass } from 'lucide-react'

// Define the Event entry type
type EventEntry = {
    id: string;
    title: string;
    description: string;
    event_date: string;
    start_time: string;
    end_time: string;
    venue: string;
    club_id: string;
    image_url: string | null;
    club: {
        name: string;
    };
    _count?: {
        rsvps: number;
    }
}

export default async function EventsBoardPage() {
    // Force use of Service Role Key to bypass any accidental RLS restrictions
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    )

    // Fetch upcoming events ordered by date
    // We join the clubs table to get the club name
    const { data: events, error } = await supabase
        .from('events')
        .select(`
            *,
            club:clubs(name)
        `)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })

    if (error) {
        console.error('Error fetching events:', error)
    }

    // Helper to format date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }

    // Helper to format 24h time to 12h
    const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':')
        const h = parseInt(hours)
        const ampm = h >= 12 ? 'PM' : 'AM'
        const h12 = h % 12 || 12
        return `${h12}:${minutes} ${ampm}`
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-primary-100 text-primary-600 p-4 rounded-2xl shrink-0">
                        <Compass size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Campus Events</h1>
                        <p className="text-gray-500 font-medium">Discover workshops, seminars, and cultural fests happening around you.</p>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    <button className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-bold border border-gray-200 transition-colors shadow-sm flex items-center gap-2">
                        <Ticket size={18} strokeWidth={2.5} />
                        My RSVPs
                    </button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl leading-5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow font-medium shadow-sm"
                    />
                </div>

                <div className="flex gap-4">
                    <select className="bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm outline-none appearance-none pr-10 cursor-pointer">
                        <option value="upcoming">Upcoming First</option>
                        <option value="this_week">This Week</option>
                        <option value="next_month">Next Month</option>
                    </select>
                </div>
            </div>

            {/* Events List */}
            <div className="space-y-6">
                {events && events.length > 0 ? (
                    events.map((event: any) => (
                        <div key={event.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col md:flex-row overflow-hidden relative">

                            {/* Date Badge (Left Side or Top on Mobile) */}
                            <div className="w-full md:w-48 bg-primary-50/50 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center justify-center p-4 md:p-6 shrink-0 group-hover:bg-primary-50 transition-colors">
                                <span className="text-primary-600 font-bold uppercase tracking-wider text-xs md:text-sm mb-1">
                                    {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
                                </span>
                                <span className="text-4xl font-black text-gray-900 leading-none mb-2">
                                    {new Date(event.event_date).getDate()}
                                </span>
                                <span className="text-gray-500 font-medium text-sm">
                                    {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long' })}
                                </span>
                            </div>

                            {/* Main Content */}
                            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100 flex items-center gap-1.5">
                                            {/* @ts-ignore - The join returns either an array or object depending on relation, Supabase typed as any usually */}
                                            {event.club?.[0]?.name || event.club?.name || 'College Event'}
                                        </div>
                                    </div>

                                    <h3 className="font-extrabold text-2xl text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                                        {event.title}
                                    </h3>

                                    <p className="text-gray-500 font-medium text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-6 max-w-3xl">
                                        {event.description}
                                    </p>
                                </div>

                                {/* Event Meta Data */}
                                <div className="flex flex-wrap gap-x-6 gap-y-3 mt-auto pt-4 border-t border-gray-100 text-sm font-medium text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={16} className="text-gray-400" />
                                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} className="text-gray-400" />
                                        {event.venue}
                                    </div>
                                </div>
                            </div>

                            {/* Action Area (Right Side) */}
                            <div className="md:w-56 p-6 md:p-8 bg-gray-50 md:border-l border-gray-100 flex flex-col items-center justify-center shrink-0">
                                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-primary-500/20 active:scale-95">
                                    <Ticket size={20} />
                                    RSVP Now
                                </button>
                                <p className="text-xs text-gray-500 font-medium mt-3 text-center">
                                    Secures your spot instantly.
                                </p>
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <Calendar size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming events</h3>
                        <p className="text-gray-500">Check back later for new workshops and activities.</p>
                    </div>
                )}
            </div>

        </div>
    )
}
