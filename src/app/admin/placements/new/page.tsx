'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { createPlacement, createInternship } from '../../actions'

export default function NewPlacementPage() {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [listingType, setListingType] = useState<'placement' | 'internship'>('placement')

    const [formData, setFormData] = useState({
        company_name: '',
        role_title: '',
        ctc_min: '',
        ctc_max: '',
        application_deadline: '',
        application_link: '',
        eligible_branches: '',
        // Internship specific
        duration_months: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMsg('')

        try {
            const branchesArray = formData.eligible_branches.split(',').map(b => b.trim()).filter(Boolean)

            if (listingType === 'placement') {
                const payload = {
                    company_name: formData.company_name,
                    role_title: formData.role_title,
                    ctc_min: parseFloat(formData.ctc_min) || null,
                    ctc_max: parseFloat(formData.ctc_max) || null,
                    application_deadline: formData.application_deadline,
                    application_link: formData.application_link,
                    eligible_branches: branchesArray
                }
                await createPlacement(payload)
            } else {
                const payload = {
                    company_name: formData.company_name,
                    role_title: formData.role_title,
                    stipend_min: parseFloat(formData.ctc_min) || null,
                    stipend_max: parseFloat(formData.ctc_max) || null,
                    duration_months: parseInt(formData.duration_months) || null,
                    application_deadline: formData.application_deadline,
                    application_link: formData.application_link,
                    eligible_branches: branchesArray
                }
                await createInternship(payload)
            }

            setIsSuccess(true)
            setTimeout(() => {
                router.push('/admin/placements')
                router.refresh()
            }, 1500)

        } catch (err: any) {
            console.error('Submission Error:', err)
            setErrorMsg(err.message || 'Failed to create listing')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="max-w-3xl mx-auto py-24 text-center">
                <div className="bg-green-50 text-green-600 p-6 rounded-full inline-flex mb-6">
                    <CheckCircle2 size={48} strokeWidth={2} />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Job Listing Posted!</h1>
                <p className="text-gray-500 font-medium">Redirecting to careers dashboard...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">

            {/* Nav Header */}
            <div className="mb-6 lg:mb-8">
                <Link href="/admin/placements" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-4">
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    Back to Placements
                </Link>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-xl shrink-0">
                        <Briefcase size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Post Job Listing</h1>
                        <p className="text-sm font-medium text-gray-500">Publish a new placement or internship opportunity.</p>
                    </div>
                </div>
            </div>

            {/* Type Selector Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 w-max">
                <button
                    onClick={() => setListingType('placement')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${listingType === 'placement'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Full-Time Placement
                </button>
                <button
                    onClick={() => setListingType('internship')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${listingType === 'internship'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Internship
                </button>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl p-5 lg:p-8 border border-gray-100 shadow-sm">

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Company Name</label>
                            <input
                                type="text"
                                name="company_name"
                                required
                                value={formData.company_name}
                                onChange={handleChange}
                                placeholder="e.g. Google India"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Role Title</label>
                            <input
                                type="text"
                                name="role_title"
                                required
                                value={formData.role_title}
                                onChange={handleChange}
                                placeholder="e.g. Software Engineer"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                {listingType === 'placement' ? 'Min CTC (LPA)' : 'Min Stipend (/mo)'}
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                name="ctc_min"
                                required
                                value={formData.ctc_min}
                                onChange={handleChange}
                                placeholder={listingType === 'placement' ? "e.g. 12" : "e.g. 25000"}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                {listingType === 'placement' ? 'Max CTC (LPA)' : 'Max Stipend (/mo)'}
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                name="ctc_max"
                                required
                                value={formData.ctc_max}
                                onChange={handleChange}
                                placeholder={listingType === 'placement' ? "e.g. 15" : "e.g. 30000"}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        {listingType === 'internship' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Duration (Months)</label>
                                <input
                                    type="number"
                                    name="duration_months"
                                    required
                                    value={formData.duration_months}
                                    onChange={handleChange}
                                    placeholder="e.g. 6"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Application Deadline</label>
                            <input
                                type="date"
                                name="application_deadline"
                                required
                                value={formData.application_deadline}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors uppercase"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Eligible Branches (Comma Separated)</label>
                            <input
                                type="text"
                                name="eligible_branches"
                                required
                                value={formData.eligible_branches}
                                onChange={handleChange}
                                placeholder="CSE, IT, ECE"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Application / Career Link</label>
                            <input
                                type="url"
                                name="application_link"
                                required
                                value={formData.application_link}
                                onChange={handleChange}
                                placeholder="https://careers.company.com/..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                `Publish ${listingType === 'placement' ? 'Placement' : 'Internship'}`
                            )}
                        </button>
                    </div>

                </form>
            </div>

        </div>
    )
}
