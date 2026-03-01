import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { BookOpen, AlertCircle, Trash2, DownloadCloud, CheckCircle, UploadCloud } from 'lucide-react'
import Link from 'next/link'

export default async function AdminNotesPage() {
    // Force use of Service Role Key to bypass any accidental RLS restrictions
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    )

    // Fetch notes with uploader info (profiles joined via user_id)
    const { data: notes, error } = await supabase
        .from('notes')
        .select(`
            *,
            profiles:uploaded_by (full_name)
        `)
        .order('created_at', { ascending: false })

    const getFormatBadge = (url: string) => {
        if (!url) return 'UNKNOWN'
        if (url.endsWith('.pdf')) return 'PDF'
        if (url.endsWith('.doc') || url.endsWith('.docx')) return 'DOCX'
        if (url.endsWith('.ppt') || url.endsWith('.pptx')) return 'PPTX'
        return 'FILE'
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl shrink-0 hidden md:block">
                        <BookOpen size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">Notes Oversight</h1>
                        <p className="text-gray-500 font-medium text-sm lg:text-base">Monitor and moderate study materials uploaded by students.</p>
                    </div>
                </div>

                <div className="flex relative z-10 w-full md:w-auto">
                    <Link
                        href="/admin/notes/new"
                        className="w-full justify-center bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md shadow-gray-900/10"
                    >
                        <UploadCloud size={20} strokeWidth={2.5} />
                        Upload Note
                    </Link>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                    <h4 className="font-bold text-blue-900 mb-1">Moderation Dashboard</h4>
                    <p className="text-sm text-blue-700 font-medium leading-relaxed">
                        This view allows you to oversee all notes uploaded to the platform. You can review materials and remove inappropriate or irrelevant content to maintain quality.
                    </p>
                </div>
            </div>

            {/* Content Table/List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Document Title</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Format</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Uploader</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Upload Date</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {notes && notes.length > 0 ? (
                                notes.map((note) => (
                                    <tr key={note.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4">
                                            <p className="font-bold text-gray-900 mb-1">{note.title}</p>
                                            <p className="text-xs text-gray-500 font-medium line-clamp-1">{note.description}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border bg-gray-50 text-gray-600 border-gray-200">
                                                {getFormatBadge(note.file_url)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                                                    {(note.profiles?.full_name || 'U').charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">
                                                    {note.profiles?.full_name || 'Unknown User'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-gray-600">
                                            {new Date(note.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {note.file_url && (
                                                    <a
                                                        href={note.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-400 hover:text-indigo-600 bg-white hover:bg-indigo-50 rounded-xl border border-gray-100 transition-colors"
                                                        title="Review Document"
                                                    >
                                                        <DownloadCloud size={16} strokeWidth={2.5} />
                                                    </a>
                                                )}
                                                <button
                                                    className="p-2 text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-xl border border-gray-100 transition-colors"
                                                    title="Remove Note"
                                                >
                                                    <Trash2 size={16} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No notes have been uploaded yet.
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
