import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Briefcase, Building2, Calendar, IndianRupee, Clock, ArrowUpRight, GraduationCap, MapPin, Tag } from 'lucide-react'

// Define the Job entry type (union roughly of Placements and Internships)
type JobEntry = {
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

export default async function PlacementsBoardPage() {
    // Force use of Service Role Key to bypass any accidental RLS restrictions
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    )

    // Fetch placements
    const { data: placementsRaw, error: err1 } = await supabase
        .from('placement_listings')
        .select('*')
        .order('application_deadline', { ascending: true })

    // Fetch internships
    const { data: internshipsRaw, error: err2 } = await supabase
        .from('internship_listings')
        .select('*')
        .order('application_deadline', { ascending: true })

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
                application_link: p.application_link,
                requirements: p.eligible_branches || [],
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
                duration: `${i.duration_months} Months`,
                deadline: i.application_deadline,
                application_link: i.application_link,
                requirements: i.eligible_branches || [],
                type: 'internship'
            })
        })
    }

    // Sort all combined by deadline
    jobs.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())

    // Helper to format days left
    const getDaysLeft = (deadlineDateStr: string) => {
        const diffTime = Math.abs(new Date(deadlineDateStr).getTime() - new Date().getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100 mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-primary-100 text-primary-600 p-4 rounded-2xl shrink-0 hidden md:block">
                        <Briefcase size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">Career & Placements</h1>
                        <p className="text-gray-500 font-medium text-sm lg:text-base">Discover full-time roles, internships, and start applying today.</p>
                    </div>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs && jobs.length > 0 ? (
                    jobs.map((job) => {
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
                        <p className="text-gray-500">Wait for the placement cell to post new openings.</p>
                    </div>
                )}
            </div>

        </div>
    )
}
