'use client'

import { useState, useMemo } from 'react'
import { FileText, Download, Search, Tag } from 'lucide-react'

// Define the Note entry type
export type NoteEntry = {
    id: string;
    title: string;
    description: string;
    subject: string;
    note_type: string;
    file_name: string;
    file_size: number;
    file_url?: string;
    tags: string[];
    created_at: string;
}

// Helper to format file size
const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

// Helper to get color theme by note type
const getTypeTheme = (type: string) => {
    switch (type) {
        case 'lecture': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'question_paper': return 'bg-purple-50 text-purple-600 border-purple-100'
        case 'reference': return 'bg-green-50 text-green-600 border-green-100'
        case 'lab': return 'bg-orange-50 text-orange-600 border-orange-100'
        default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
}

export default function NotesClient({ initialNotes }: { initialNotes: NoteEntry[] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('all')

    // Extract unique subjects from notes for the filter dropdown
    const subjects = useMemo(() => {
        const subs = new Set(initialNotes.map(n => n.subject).filter(Boolean))
        return Array.from(subs).sort()
    }, [initialNotes])

    // Filter notes based on search query and selected subject
    const filteredNotes = useMemo(() => {
        return initialNotes.filter(note => {
            const matchesSearch =
                (note.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (note.subject?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (note.tags && note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))

            const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject

            return matchesSearch && matchesSubject
        })
    }, [initialNotes, searchQuery, selectedSubject])

    return (
        <>
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by title, subject, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl leading-5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow font-medium shadow-sm"
                    />
                </div>

                <div className="flex gap-4">
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm outline-none appearance-none pr-10 cursor-pointer min-w-[180px]"
                    >
                        <option value="all">All Subjects</option>
                        {subjects.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes && filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                        <div key={note.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col h-full relative overflow-hidden">

                            {/* Top row */}
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getTypeTheme(note.note_type)}`}>
                                    {note.note_type.replace('_', ' ')}
                                </div>
                            </div>

                            {/* Main Info */}
                            <h3 className="font-bold text-lg text-gray-900 mb-2 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                                {note.title}
                            </h3>
                            <p className="text-sm font-medium text-gray-500 mb-4 line-clamp-2">
                                {note.subject}
                            </p>

                            {/* Tags */}
                            {note.tags && note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-auto pb-4">
                                    {note.tags.map((tag: string, i: number) => (
                                        <span key={i} className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                            <Tag size={10} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">File Size</span>
                                    <span className="text-xs font-bold text-gray-700">{formatBytes(note.file_size)}</span>
                                </div>

                                <a
                                    href={note.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-50 hover:bg-primary-50 text-gray-600 hover:text-primary-600 p-2.5 rounded-xl transition-colors border border-gray-100 hover:border-primary-100 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100"
                                    title="Download Document"
                                >
                                    <Download size={18} strokeWidth={2.5} />
                                </a>
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <FileText size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No notes found</h3>
                        <p className="text-gray-500">Could not find any materials matching your filters.</p>
                    </div>
                )}
            </div>
        </>
    )
}
