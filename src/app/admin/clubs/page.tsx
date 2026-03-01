import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Users, Plus, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default async function AdminClubsPage() {
    // Force use of Service Role Key to bypass any accidental RLS restrictions
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    )

    // Fetch clubs ordered by name
    const { data: clubs, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name', { ascending: true })

    const getCategoryBadge = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'technical': return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'cultural': return 'bg-pink-50 text-pink-600 border-pink-100'
            case 'sports': return 'bg-orange-50 text-orange-600 border-orange-100'
            case 'literary': return 'bg-purple-50 text-purple-600 border-purple-100'
            default: return 'bg-gray-50 text-gray-600 border-gray-200'
        }
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-green-100 text-green-600 p-4 rounded-2xl shrink-0 hidden md:block">
                        <Users size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">Clubs & Societies</h1>
                        <p className="text-gray-500 font-medium text-sm lg:text-base">Manage student organizations and memberships.</p>
                    </div>
                </div>

                <div className="flex relative z-10 w-full md:w-auto mt-2 md:mt-0">
                    <Link href="/admin/clubs/new" className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2">
                        <Plus size={18} strokeWidth={2.5} />
                        Register Club
                    </Link>
                </div>
            </div>

            {/* Content Table/List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">Club Details</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Members</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Established</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {clubs && clubs.length > 0 ? (
                                clubs.map((club) => (
                                    <tr key={club.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                                                {club.logo_url ? (
                                                    <img src={club.logo_url} alt={club.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users size={20} className="text-gray-400" strokeWidth={2.5} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 mb-0.5">{club.name}</p>
                                                <p className="text-xs text-gray-500 font-medium line-clamp-1">{club.description}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadge(club.category)}`}>
                                                {club.category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-bold">
                                                {club.member_count || 0}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-gray-600">
                                            {club.founded_year || '-'}
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-gray-400 hover:text-indigo-600 bg-white hover:bg-indigo-50 rounded-xl border border-gray-100 transition-colors">
                                                    <Edit2 size={16} strokeWidth={2.5} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-xl border border-gray-100 transition-colors">
                                                    <Trash2 size={16} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No clubs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
