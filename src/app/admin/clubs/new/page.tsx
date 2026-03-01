'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/ui/ImageUpload'
import { createClub } from '../../actions'

export default function NewClubPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'technical',
        founded_year: new Date().getFullYear().toString(),
        logo_url: '',
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
                name: formData.name,
                description: formData.description,
                category: formData.category,
                founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
                logo_url: formData.logo_url || null,
            }

            await createClub(payload)

            setIsSuccess(true)
            setTimeout(() => {
                router.push('/admin/clubs')
                router.refresh()
            }, 1500)

        } catch (err: any) {
            console.error('Submission Error:', err)
            setErrorMsg(err.message || 'Failed to create club')
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
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Club Registered!</h1>
                <p className="text-gray-500 font-medium">Redirecting to clubs directory...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">

            {/* Nav Header */}
            <div className="mb-8">
                <Link href="/admin/clubs" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-4">
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    Back to Clubs
                </Link>
                <div className="flex items-center gap-4">
                    <div className="bg-green-100 text-green-600 p-3 rounded-xl shrink-0">
                        <Users size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Register New Club</h1>
                        <p className="text-sm font-medium text-gray-500">Add a new student organization to the directory.</p>
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
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Club Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Coding Club"
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
                                <option value="literary">Literary</option>
                                <option value="art">Art & Design</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Founded Year</label>
                            <input
                                type="number"
                                name="founded_year"
                                value={formData.founded_year}
                                onChange={handleChange}
                                placeholder="e.g. 2024"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <ImageUpload
                                bucketName="club-logos"
                                label="Club Logo (Optional)"
                                onUploadComplete={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                                currentImageUrl={formData.logo_url}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Description & About</label>
                        <textarea
                            name="description"
                            required
                            rows={5}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="What does the club do? Who can join?"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                        ></textarea>
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
                                    Registering...
                                </>
                            ) : (
                                'Register Club'
                            )}
                        </button>
                    </div>

                </form>
            </div>

        </div>
    )
}
