import { createClient } from '@/lib/supabase/server'
import { FileText } from 'lucide-react'
import NotesClient, { NoteEntry } from '@/components/student/NotesClient'

export default async function NotesLibraryPage() {
    const supabase = await createClient()

    // Fetch notes ordered by newest first
    const { data: notes, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching notes:', error)
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-primary-100 text-primary-600 p-4 rounded-2xl shrink-0">
                        <FileText size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">Notes Library</h1>
                        <p className="text-gray-500 font-medium">Browse, download, and share study materials.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Upload button removed. Only Admins can upload notes now. */}
                </div>
            </div>

            <NotesClient initialNotes={(notes as NoteEntry[]) || []} />

        </div>
    )
}
