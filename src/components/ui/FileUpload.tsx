'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UploadCloud, X, Loader2, FileText } from 'lucide-react'

interface FileUploadProps {
    bucketName: string
    folderPath?: string
    onUploadComplete: (url: string, fileName: string, fileSize: number) => void
    currentFileUrl?: string
    label?: string
    className?: string
}

export default function FileUpload({
    bucketName,
    folderPath = '',
    onUploadComplete,
    currentFileUrl,
    label = 'Upload Document',
    className = ''
}: FileUploadProps) {
    const supabase = createClient()
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentFileUrl || null)
    const [errorMsg, setErrorMsg] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Basic validation for documents
        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ]

        if (!validTypes.includes(file.type)) {
            setErrorMsg('Please select a valid document (PDF, DOC/DOCX, PPT/PPTX).')
            return
        }

        if (file.size > 20 * 1024 * 1024) { // 20MB limit for notes
            setErrorMsg('File size should be less than 20MB.')
            return
        }

        setErrorMsg('')
        setIsUploading(true)

        try {
            // Generate a unique file name
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            const filePath = folderPath ? `${folderPath}/${fileName}` : fileName

            // Upload the file to Supabase storage
            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) throw error

            // Get the public URL for the uploaded file
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath)

            setPreviewUrl(publicUrl)
            onUploadComplete(publicUrl, file.name, file.size)

        } catch (error: any) {
            console.error('Upload error:', error)
            setErrorMsg(error.message || 'Failed to upload document. Please ensure the storage bucket exists and is public.')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const clearPreview = () => {
        setPreviewUrl(null)
        onUploadComplete('', '', 0)
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide block">
                {label}
            </label>

            {errorMsg && (
                <div className="text-xs text-red-500 font-medium mb-2">
                    {errorMsg}
                </div>
            )}

            <div className="relative">
                {previewUrl ? (
                    <div className="relative rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between p-4 group">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-primary-100 text-primary-600 p-3 rounded-xl shrink-0">
                                <FileText size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">Document Uploaded Successfully</p>
                                <p className="text-xs font-medium text-gray-500 truncate">{previewUrl.split('/').pop()}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={clearPreview}
                            className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors ml-4 shrink-0"
                            title="Remove File"
                        >
                            <X size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {isUploading ? (
                            <div className="flex flex-col items-center justify-center text-primary-600">
                                <Loader2 size={32} className="animate-spin mb-3" />
                                <span className="text-sm font-bold">Uploading...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-500 hover:text-primary-600 transition-colors">
                                <UploadCloud size={40} className="mb-3" strokeWidth={1.5} />
                                <span className="text-sm font-bold text-gray-700 mb-1">Click to upload study material</span>
                                <span className="text-xs font-medium">PDF, DOC, DOCX, PPT, PPTX (max. 20MB)</span>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                            className="hidden"
                            disabled={isUploading}
                        />
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-400 font-medium mt-1">
                Files are uploaded securely to the <span className="font-mono text-gray-500">{bucketName}</span> repository.
            </p>
        </div>
    )
}
