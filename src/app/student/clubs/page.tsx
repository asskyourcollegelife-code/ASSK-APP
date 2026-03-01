import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Users, LayoutGrid, Search, Filter, ShieldCheck, Heart, ExternalLink } from 'lucide-react'

// Define the Club entry type
type ClubEntry = {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    member_count: number;
    is_accepting_members: boolean;
    logo_url: string | null;
    banner_url: string | null;
}

export default async function ClubsPage() {
    // Force use of Service Role Key to bypass any accidental RLS restrictions
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    )

    // Fetch active clubs ordered by member count
    const { data: clubs, error } = await supabase
        .from('clubs')
        .select('*')
        .order('member_count', { ascending: false })

    if (error) {
        console.error('Error fetching clubs:', error)
    }

    // Helper to get color theme by category
    const getCategoryTheme = (category: string) => {
        switch (category) {
            case 'technical': return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'cultural': return 'bg-purple-50 text-purple-600 border-purple-100'
            case 'sports': return 'bg-green-50 text-green-600 border-green-100'
            case 'social': return 'bg-orange-50 text-orange-600 border-orange-100'
            case 'academic': return 'bg-teal-50 text-teal-600 border-teal-100'
            default: return 'bg-gray-50 text-gray-600 border-gray-100'
        }
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-purple-50 rounded-full blur-2xl opacity-50 translate-y-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-primary-100 text-primary-600 p-4 rounded-2xl shrink-0 hidden md:block">
                        <Users size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">Clubs & Societies</h1>
                        <p className="text-gray-500 font-medium text-sm lg:text-base">Discover communities, follow your passion, and connect with peers.</p>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    <button className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-bold border border-gray-200 transition-colors shadow-sm flex items-center gap-2">
                        <ShieldCheck size={18} strokeWidth={2.5} />
                        My Memberships
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
                        placeholder="Search clubs by name or keywords..."
                        className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl leading-5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow font-medium shadow-sm"
                    />
                </div>

                <div className="flex gap-4">
                    <select className="bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm outline-none appearance-none pr-10 cursor-pointer w-48">
                        <option value="all">All Categories</option>
                        <option value="technical">Technical</option>
                        <option value="cultural">Cultural</option>
                        <option value="sports">Sports</option>
                        <option value="social">Social</option>
                    </select>

                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-1 flex">
                        <button className="bg-gray-100 text-gray-800 p-2 rounded-lg"><LayoutGrid size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs && clubs.length > 0 ? (
                    clubs.map((club: ClubEntry) => (
                        <div key={club.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full overflow-hidden">

                            {/* Banner Placeholder */}
                            <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 relative w-full overflow-hidden">
                                {club.banner_url ? (
                                    <img src={club.banner_url} alt={`${club.name} banner`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                        <Users size={64} className="text-gray-400 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col relative pt-12">
                                {/* Club Logo (overlapping banner) */}
                                <div className="absolute -top-10 left-6 h-20 w-20 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-3xl font-black text-gray-300 overflow-hidden">
                                    {club.logo_url ? (
                                        <img src={club.logo_url} alt={`${club.name} logo`} className="w-full h-full object-cover" />
                                    ) : (
                                        club.name.substring(0, 2).toUpperCase()
                                    )}
                                </div>

                                {/* Top right badges */}
                                <div className="absolute top-4 right-6 flex gap-2">
                                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getCategoryTheme(club.category)}`}>
                                        {club.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="font-extrabold text-xl text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                                    {club.name}
                                </h3>

                                <p className="text-sm font-medium text-gray-500 mb-6 line-clamp-3 leading-relaxed flex-1">
                                    {club.description}
                                </p>

                                {/* Footer Data & Actions */}
                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600">
                                        <Users size={16} className="text-gray-400" />
                                        {club.member_count} <span className="font-normal text-gray-400 text-xs ml-0.5">members</span>
                                    </div>

                                    {club.is_accepting_members ? (
                                        <button className="bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5">
                                            Join Club
                                        </button>
                                    ) : (
                                        <span className="bg-gray-50 text-gray-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-gray-100 flex items-center gap-1">
                                            Closed
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <Users size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No clubs registered</h3>
                        <p className="text-gray-500">Wait for the administration to publish student clubs.</p>
                    </div>
                )}
            </div>

        </div>
    )
}
