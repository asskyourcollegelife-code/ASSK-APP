import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Megaphone, Calendar, Clock, Pin } from 'lucide-react'

// Define the Announcement type based on our database schema
type Announcement = {
    id: string;
    title: string;
    body: string;
    category: 'general' | 'academic' | 'events' | 'placement' | 'urgent' | 'clubs';
    created_at: string;
}

export default async function AnnouncementsPage() {
    // Force use of Service Role Key to bypass any accidental RLS restrictions
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    )

    // Fetch announcements ordered by creation date
    const { data: announcements, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching announcements:', error)
    }

    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        })
    }

    // Helper to determine badge styling based on category
    const getCategoryBadge = (category: string) => {
        switch (category) {
            case 'urgent':
                return <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-red-100">Urgent</span>
            case 'events':
            case 'clubs':
                return <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-orange-100">Event</span>
            case 'academic':
                return <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-blue-100">Academic</span>
            default:
                return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold tracking-wider border border-gray-200 uppercase">General</span>
        }
    }

    return (
        <div className="max-w-5xl mx-auto pb-12">

            {/* Header */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="bg-primary-100 text-primary-600 p-4 rounded-2xl hidden md:block">
                    <Megaphone size={32} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">Notice Board</h1>
                    <p className="text-gray-500 font-medium">Stay updated with the latest campus news and important alerts.</p>
                </div>
            </div>

            {/* Feed */}
            <div className="space-y-6">
                {announcements && announcements.length > 0 ? (
                    announcements.map((item: Announcement) => (
                        <div key={item.id} className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 lg:gap-6 hover:shadow-md transition-shadow group relative overflow-hidden">

                            {/* Highlight bar for urgent items */}
                            {item.category === 'urgent' && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
                            )}

                            {/* Date Column */}
                            <div className="hidden md:flex flex-col items-center justify-center min-w-[100px] border-r border-gray-100 pr-6">
                                <span className="text-2xl font-black text-gray-900">
                                    {new Date(item.created_at).getDate()}
                                </span>
                                <span className="text-sm font-bold text-gray-400 uppercase">
                                    {new Date(item.created_at).toLocaleString('en-US', { month: 'short' })}
                                </span>
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    {getCategoryBadge(item.category)}
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                        <Clock size={12} strokeWidth={2.5} />
                                        {formatDate(item.created_at)}
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary-600 transition-colors">
                                    {item.title}
                                </h2>

                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {item.body}
                                </p>

                                <div className="mt-6 flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                            AD
                                        </div>
                                        Posted by Administration
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="text-center bg-white rounded-3xl py-16 border border-gray-100 shadow-sm">
                        <Megaphone size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No active announcements</h3>
                        <p className="text-gray-500">Check back later for important updates and notifications.</p>
                    </div>
                )}
            </div>

        </div>
    )
}
