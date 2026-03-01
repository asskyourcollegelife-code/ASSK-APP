import { createClient } from '@/lib/supabase/server'
import { Briefcase, Plus, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'

type JobEntry = {
    id: string;
    company_name: string;
    role_title: string;
    compensation: string;
    deadline: string;
    type: 'placement' | 'internship';
}

export default async function AdminPlacementsPage() {
    const supabase = await createClient()

    // Fetch placements
    const { data: placementsRaw, error: err1 } = await supabase
        .from('placement_listings')
        .select('*')
        .order('application_deadline', { ascending: false })

    // Fetch internships
    const { data: internshipsRaw, error: err2 } = await supabase
        .from('internship_listings')
        .select('*')
        .order('application_deadline', { ascending: false })

    // Normalize Data
    const jobs: JobEntry[] = []

    if (placementsRaw) {
        placementsRaw.forEach(p => {
            jobs.push({
                id: `p-${p.id}`,
                company_name: p.company_name,
                role_title: p.role_title,
                compensation: p.ctc_max && p.ctc_min !== p.ctc_max ? `${p.ctc_min} - ${p.ctc_max} LPA` : `${p.ctc_min} LPA`,
                deadline: p.application_deadline,
                type: 'placement'
            })
        })
    }

    if (internshipsRaw) {
        internshipsRaw.forEach(i => {
            jobs.push({
                id: `i-${i.id}`,
                company_name: i.company_name,
                role_title: i.role_title,
                compensation: i.stipend_max && i.stipend_min !== i.stipend_max ? `₹${i.stipend_min} - ₹${i.stipend_max}/mo` : `₹${i.stipend_min}/mo`,
                deadline: i.application_deadline,
                type: 'internship'
            })
        })
    }

    // Sort all combined by deadline
    jobs.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())

    return (
        <div className="max-w-7xl mx-auto pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl shrink-0 hidden md:block">
                        <Briefcase size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">Career & Placements</h1>
                        <p className="text-gray-500 font-medium text-sm lg:text-base">Manage job postings, internships, and company visits.</p>
                    </div>
                </div>

                <div className="flex relative z-10 w-full md:w-auto mt-2 md:mt-0">
                    <Link href="/admin/placements/new" className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2">
                        <Plus size={18} strokeWidth={2.5} />
                        Post Job listing
                    </Link>
                </div>
            </div>

            {/* Content Table/List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Company / Role</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Compensation</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {jobs && jobs.length > 0 ? (
                                jobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4">
                                            <p className="font-bold text-gray-900 mb-1">{job.company_name}</p>
                                            <p className="text-xs text-gray-500 font-medium">{job.role_title}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${job.type === 'placement' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                                                }`}>
                                                {job.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-700">
                                            {job.compensation}
                                        </td>
                                        <td className="p-4 text-sm font-medium text-gray-600">
                                            {new Date(job.deadline).toLocaleDateString()}
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
                                        No job listings found.
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
