import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Briefcase } from 'lucide-react'
import PlacementsClient, { JobEntry } from '@/components/student/PlacementsClient'

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

            <PlacementsClient initialJobs={jobs} />

        </div>
    )
}
