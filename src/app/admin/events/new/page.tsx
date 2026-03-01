'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar as CalendarIcon, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/ui/ImageUpload'
import { createEvent } from '../../actions'

export default function NewEventPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'technical',
        event_date: '',
        start_time: '',
        venue: '',
        registration_link: '',
        image_url: '',
        is_published: true
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        setFormData(prev => ({ ...prev, [name]: val }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMsg('')

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                event_date: formData.event_date,
                start_time: formData.start_time || null,
                venue: formData.venue,
                registration_link: formData.registration_link,
                image_url: formData.image_url || null,
                is_published: formData.is_published,
            }

            await createEvent(payload)

            setIsSuccess(true)
            setTimeout(() => {
                router.push('/admin/events')
                router.refresh()
            }, 1500)

        } catch (err: any) {
            console.error('Submission Error:', err)
            setErrorMsg(err.message || 'Failed to create event')
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
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Event Created!</h1>
                <p className="text-gray-500 font-medium">Redirecting to event dashboard...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">

            {/* Nav Header */}
            <div className="mb-8">
                <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-4">
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    Back to Events
                </Link>
                <div className="flex items-center gap-4">
                    <div className="bg-pink-100 text-pink-600 p-3 rounded-xl shrink-0">
                        <CalendarIcon size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Create New Event</h1>
                        <p className="text-sm font-medium text-gray-500">Plan and publish a campus or club event.</p>
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
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Event Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Annual Tech Hackathon"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors appearance-none"
                            >
                                <option value="technical">Technical</option>
                                <option value="cultural">Cultural</option>
                                <option value="sports">Sports</option>
                                <option value="workshop">Workshop</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Date</label>
                            <input
                                type="date"
                                name="event_date"
                                required
                                value={formData.event_date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors uppercase"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Start Time</label>
                            <input
                                type="time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Venue / Location</label>
                            <input
                                type="text"
                                name="venue"
                                required
                                value={formData.venue}
                                onChange={handleChange}
                                placeholder="e.g. Main Auditorium"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">External Registration Link (Optional)</label>
                            <input
                                type="url"
                                name="registration_link"
                                value={formData.registration_link}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Detailed Description</label>
                        <textarea
                            name="description"
                            required
                            rows={5}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Full details of the event schedule, rules, etc."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <ImageUpload
                            bucketName="event-banners"
                            label="Event Banner Image (Optional)"
                            onUploadComplete={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                            currentImageUrl={formData.image_url}
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onChange={handleChange}
                                    className="peer sr-only"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </div>
                            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">Publish to Students Dashboard</span>
                        </label>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating Event...
                                </>
                            ) : (
                                'Publish Event'
                            )}
                        </button>
                    </div>

                </form>
            </div>

        </div>
    )
}
