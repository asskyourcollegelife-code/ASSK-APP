'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import FileUpload from '@/components/ui/FileUpload'
import { createNote } from '../../actions'

export default function NewNotePage() {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        year: '1',
        semester: '1',
        department: '',
        note_type: 'lecture',
        file_url: '',
        file_name: '',
        file_size: 0
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMsg('')

        if (!formData.file_url) {
            setErrorMsg('Please upload a document before submitting.')
            setIsLoading(false)
            return
        }

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                subject: formData.subject,
                year: parseInt(formData.year),
                semester: parseInt(formData.semester),
                department: formData.department,
                note_type: formData.note_type,
                file_url: formData.file_url,
                file_name: formData.file_name,
                file_size: formData.file_size
            }

            await createNote(payload)

            setIsSuccess(true)
            setTimeout(() => {
                router.push('/admin/notes')
                router.refresh()
            }, 1500)

        } catch (err: any) {
            console.error('Submission Error:', err)
            setErrorMsg(err.message || 'Failed to upload note')
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
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Note Uploaded!</h1>
                <p className="text-gray-500 font-medium">Redirecting to Notes Oversight...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">

            {/* Nav Header */}
            <div className="mb-8">
                <Link href="/admin/notes" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-4">
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    Back to Notes Oversight
                </Link>
                <div className="flex items-center gap-4">
                    <div className="bg-amber-100 text-amber-600 p-3 rounded-xl shrink-0">
                        <BookOpen size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Upload Study Material</h1>
                        <p className="text-sm font-medium text-gray-500">Provide official resources for students to access.</p>
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
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Document Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Chapter 4: Sorting Algorithms"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Subject / Course</label>
                            <input
                                type="text"
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="e.g. Data Structures"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Department</label>
                            <input
                                type="text"
                                name="department"
                                required
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="e.g. Computer Science"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Year & Semester</label>
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors appearance-none"
                                >
                                    {[1, 2, 3, 4, 5, 6].map(y => (
                                        <option key={y} value={y}>Year {y}</option>
                                    ))}
                                </select>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors appearance-none"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                        <option key={s} value={s}>Sem {s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Material Type</label>
                            <select
                                name="note_type"
                                value={formData.note_type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors appearance-none"
                            >
                                <option value="lecture">Lecture Notes</option>
                                <option value="lab">Lab Manual</option>
                                <option value="question_paper">Previous Question Paper</option>
                                <option value="reference">Reference Material</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Description & Details</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Optional info about what is covered in this document..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors resize-y"
                        />
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 mt-6">
                        <FileUpload
                            bucketName="notes"
                            label="Attach Study Material"
                            onUploadComplete={(url, name, size) => {
                                setFormData(prev => ({
                                    ...prev,
                                    file_url: url,
                                    file_name: name,
                                    file_size: size
                                }))
                            }}
                            currentFileUrl={formData.file_url}
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                `Publish Note`
                            )}
                        </button>
                    </div>

                </form>
            </div>

        </div>
    )
}
