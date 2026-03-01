'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { createExam } from '../../actions'

export default function NewExamPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [formData, setFormData] = useState({
        course_name: '',
        course_code: '',
        exam_type: 'mid-term',
        exam_date: '',
        start_time: '',
        end_time: '',
        venue: '',
        notes: ''
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
            const payload = {
                course_name: formData.course_name,
                course_code: formData.course_code.toUpperCase(),
                exam_type: formData.exam_type,
                exam_date: formData.exam_date,
                start_time: formData.start_time,
                end_time: formData.end_time,
                venue: formData.venue,
                notes: formData.notes || null,
            }

            await createExam(payload)

            setIsSuccess(true)
            setTimeout(() => {
                router.push('/admin/exams')
                router.refresh()
            }, 1500)

        } catch (err: any) {
            console.error('Submission Error:', err)
            setErrorMsg(err.message || 'Failed to post exam')
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
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Exam Schedule Posted!</h1>
                <p className="text-gray-500 font-medium">Redirecting to examinations dashboard...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">

            {/* Nav Header */}
            <div className="mb-8">
                <Link href="/admin/exams" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-4">
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    Back to Exams
                </Link>
                <div className="flex items-center gap-4">
                    <div className="bg-red-100 text-red-600 p-3 rounded-xl shrink-0">
                        <GraduationCap size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Post Exam Schedule</h1>
                        <p className="text-sm font-medium text-gray-500">Add an upcoming examination to the student portal.</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Course Title</label>
                            <input
                                type="text"
                                name="course_name"
                                required
                                value={formData.course_name}
                                onChange={handleChange}
                                placeholder="e.g. Database Management Systems"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Course Code</label>
                            <input
                                type="text"
                                name="course_code"
                                required
                                value={formData.course_code}
                                onChange={handleChange}
                                placeholder="e.g. CS401"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors uppercase"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Exam Type</label>
                            <select
                                name="exam_type"
                                required
                                value={formData.exam_type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors appearance-none"
                            >
                                <option value="mid-term">Mid-Term</option>
                                <option value="final">Final Exam</option>
                                <option value="quiz">Quiz / Unit Test</option>
                                <option value="practical">Practical</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Date</label>
                            <input
                                type="date"
                                name="exam_date"
                                required
                                value={formData.exam_date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors uppercase"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Start Time</label>
                                <input
                                    type="time"
                                    name="start_time"
                                    required
                                    value={formData.start_time}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">End Time</label>
                                <input
                                    type="time"
                                    name="end_time"
                                    required
                                    value={formData.end_time}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Venue / Location</label>
                            <input
                                type="text"
                                name="venue"
                                required
                                value={formData.venue}
                                onChange={handleChange}
                                placeholder="e.g. Main Examination Hall"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Important Notes / Instructions (Optional)</label>
                            <textarea
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="e.g. Bring your own scientific calculator."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                            ></textarea>
                        </div>

                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                'Publish Exam Schedule'
                            )}
                        </button>
                    </div>

                </form>
            </div>

        </div>
    )
}
