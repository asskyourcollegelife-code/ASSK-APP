import { createClient } from '@/lib/supabase/server'
import { Megaphone, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default async function AdminAnnouncementsPage() {
    const supabase = await createClient()

    // Fetch announcements ordered by creation date
    const { data: announcements, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

    const getCategoryBadge = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'urgent': return 'bg-red-50 text-red-600 border-red-100'
            case 'academic': return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'general': return 'bg-gray-50 text-gray-600 border-gray-200'
            default: return 'bg-gray-50 text-gray-600 border-gray-200'
        }
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 mb-6 lg:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 lg:gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl shrink-0 hidden md:block">
                        <Megaphone size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">Announcements</h1>
                        <p className="text-gray-500 font-medium text-sm lg:text-base">Manage and broadcast messages to all students.</p>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    <Link href="/admin/announcements/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2">
                        <Plus size={18} strokeWidth={2.5} />
                        New Post
                    </Link>
                </div>
            </div>

            {/* Content Table/List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/2">Post Details</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {announcements && announcements.length > 0 ? (
                                announcements.map((ann) => (
                                    <tr key={ann.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4">
                                            <p className="font-bold text-gray-900 mb-1">{ann.title}</p>
                                            <p className="text-xs text-gray-500 font-medium line-clamp-1">{ann.subject}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getCategoryBadge(ann.category)}`}>
                                                {ann.category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${ann.is_published ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                <span className="text-sm font-bold text-gray-700">{ann.is_published ? 'Published' : 'Draft'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-gray-600">
                                            {new Date(ann.created_at).toLocaleDateString()}
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
                                        No announcements found.
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
