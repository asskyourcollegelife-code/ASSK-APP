'use client'

import { useState, useMemo } from 'react'
import { Briefcase, Building2, Calendar, IndianRupee, Clock, ArrowUpRight, GraduationCap, Search, Filter } from 'lucide-react'

// Define the Job entry type
export type JobEntry = {
    id: string;
    company_name: string;
    role_title: string;
    compensation: string;
    deadline: string;
    application_link: string;
    requirements: string[];
    type: 'placement' | 'internship';
    duration?: string; // only for internships
}

export default function PlacementsClient({ initialJobs }: { initialJobs: JobEntry[] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState('all') // 'all', 'placement', 'internship'

    // Filter jobs based on search query and selected type
    const filteredJobs = useMemo(() => {
        return initialJobs.filter(job => {
            const matchesSearch =
                (job.company_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (job.role_title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (job.requirements && job.requirements.some(req => req.toLowerCase().includes(searchQuery.toLowerCase())))

            const matchesType = selectedType === 'all' || job.type === selectedType

            return matchesSearch && matchesType
        })
    }, [initialJobs, searchQuery, selectedType])

    // Helper to format days left
    const getDaysLeft = (deadlineDateStr: string) => {
        const diffTime = Math.abs(new Date(deadlineDateStr).getTime() - new Date().getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

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
                        placeholder="Search by company, role, or eligibility..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl leading-5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow font-medium shadow-sm"
                    />
                </div>

                <div className="flex gap-4">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm outline-none appearance-none pr-10 cursor-pointer min-w-[150px]"
                    >
                        <option value="all">All Types</option>
                        <option value="placement">Placements Full-Time</option>
                        <option value="internship">Internships</option>
                    </select>

                    <button className="bg-white border border-gray-200 text-gray-700 p-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center">
                        <Filter size={20} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredJobs && filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => {
                        const daysLeft = getDaysLeft(job.deadline);
                        const isPlacement = job.type === 'placement';
                        const isUrgent = daysLeft <= 3;

                        return (
                            <div key={job.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col h-full">

                                {/* Top Header */}
                                <div className="flex justify-between items-start mb-4 gap-4">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center font-bold text-gray-400 text-xl shrink-0">
                                            {job.company_name.substring(0, 1)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary-600 transition-colors leading-tight mb-1">
                                                {job.role_title}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                                                <Building2 size={14} className="text-gray-400" />
                                                {job.company_name}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags Row */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border flex items-center gap-1 ${isPlacement ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                        {isPlacement ? <Briefcase size={12} /> : <GraduationCap size={12} />}
                                        {job.type}
                                    </div>
                                    <div className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-100 flex items-center gap-1">
                                        <IndianRupee size={12} />
                                        {job.compensation}
                                    </div>
                                    {!isPlacement && job.duration && (
                                        <div className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-100 flex items-center gap-1">
                                            <Clock size={12} />
                                            {job.duration}
                                        </div>
                                    )}
                                </div>

                                {/* Requirements/Eligibility */}
                                {job.requirements.length > 0 && (
                                    <div className="mb-6 flex-1">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Eligibility</h4>
                                        <ul className="space-y-1">
                                            {job.requirements.map((req, i) => (
                                                <li key={i} className="text-sm font-medium text-gray-600 flex items-start gap-2">
                                                    <span className="text-primary-400 mt-1">•</span>
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Footer & Action */}
                                <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between gap-4">
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${isUrgent ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                                        <Calendar size={16} />
                                        {daysLeft === 0 ? 'Last Day!' : `${daysLeft} Days Left`}
                                    </div>

                                    <a
                                        href={job.application_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                                    >
                                        Apply Now
                                        <ArrowUpRight size={16} />
                                    </a>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <Briefcase size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No active opportunities</h3>
                        <p className="text-gray-500">Wait for the placement cell to post opportunities matching your search.</p>
                    </div>
                )}
            </div>
        </>
    )
}
