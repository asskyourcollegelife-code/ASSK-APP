'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { createTimetableClass } from '../../actions'

export default function NewTimetableClassPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [formData, setFormData] = useState({
        course_name: '',
        course_code: '',
        professor: '',
        room: '',
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '10:00'
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                professor: formData.professor,
                room: formData.room,
                day_of_week: formData.day_of_week,
                start_time: formData.start_time,
                end_time: formData.end_time
            }

            await createTimetableClass(payload)

            setIsSuccess(true)
            setTimeout(() => {
                router.push('/admin/timetable')
                router.refresh()
            }, 1500)

        } catch (err: any) {
            console.error('Submission Error:', err)
            setErrorMsg(err.message || 'Failed to schedule class')
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
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Class Scheduled!</h1>
                <p className="text-gray-500 font-medium">Redirecting to timetable...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">

            {/* Nav Header */}
            <div className="mb-8">
                <Link href="/admin/timetable" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-4">
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    Back to Timetable
                </Link>
                <div className="flex items-center gap-4">
                    <div className="bg-teal-100 text-teal-600 p-3 rounded-xl shrink-0">
                        <Calendar size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Schedule New Class</h1>
                        <p className="text-sm font-medium text-gray-500">Add a course to the weekly master schedule.</p>
                    </div>
                </div>
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
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Course Title</label>
                            <input
                                type="text"
                                name="course_name"
                                required
                                value={formData.course_name}
                                onChange={handleChange}
                                placeholder="e.g. Data Structures & Algorithms"
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
                                placeholder="e.g. CS201"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors uppercase"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Professor / Instructor</label>
                            <input
                                type="text"
                                name="professor"
                                required
                                value={formData.professor}
                                onChange={handleChange}
                                placeholder="e.g. Dr. Alan Turing"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Room / Venue</label>
                            <input
                                type="text"
                                name="room"
                                required
                                value={formData.room}
                                onChange={handleChange}
                                placeholder="e.g. Lecture Hall B"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Day of Week</label>
                            <select
                                name="day_of_week"
                                required
                                value={formData.day_of_week}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors appearance-none"
                            >
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                            </select>
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
                                    Scheduling...
                                </>
                            ) : (
                                'Schedule Class'
                            )}
                        </button>
                    </div>

                </form>
            </div>

        </div>
    )
}
