import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { GraduationCap, Plus, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default async function AdminExamsPage() {
    // Force use of Service Role Key to bypass any accidental RLS restrictions
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    )

    // Fetch exams ordered by date
    const { data: exams, error } = await supabase
        .from('exams')
        .select('*')
        .order('exam_date', { ascending: true })

    const getExamTypeBadge = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'mid-term': return 'bg-yellow-50 text-yellow-600 border-yellow-100'
            case 'final': return 'bg-red-50 text-red-600 border-red-100'
            case 'quiz': return 'bg-green-50 text-green-600 border-green-100'
            case 'practical': return 'bg-blue-50 text-blue-600 border-blue-100'
            default: return 'bg-gray-50 text-gray-600 border-gray-200'
        }
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-red-100 text-red-600 p-4 rounded-2xl shrink-0">
                        <GraduationCap size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Examinations</h1>
                        <p className="text-gray-500 font-medium">Manage and publish upcoming exam schedules.</p>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    <Link href="/admin/exams/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2">
                        <Plus size={18} strokeWidth={2.5} />
                        Post Exam
                    </Link>
                </div>
            </div>

            {/* Content Table/List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Course Details</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Venue</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {exams && exams.length > 0 ? (
                                exams.map((exam) => (
                                    <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4">
                                            <p className="font-bold text-gray-900 mb-1">{exam.course_name}</p>
                                            <p className="text-xs text-gray-500 font-medium">{exam.course_code}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getExamTypeBadge(exam.exam_type)}`}>
                                                {exam.exam_type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-bold text-gray-700">
                                                {new Date(exam.exam_date).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs font-medium text-gray-500">
                                                {exam.start_time.substring(0, 5)} - {exam.end_time.substring(0, 5)}
                                            </p>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-gray-600">
                                            {exam.venue}
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
                                        No upcoming exams found.
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
