'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
    bucketName: string
    folderPath?: string
    onUploadComplete: (url: string) => void
    currentImageUrl?: string
    label?: string
    className?: string
}

export default function ImageUpload({
    bucketName,
    folderPath = '',
    onUploadComplete,
    currentImageUrl,
    label = 'Upload Image',
    className = ''
}: ImageUploadProps) {
    const supabase = createClient()
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
    const [errorMsg, setErrorMsg] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setErrorMsg('Please select a valid image file.')
            return
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setErrorMsg('Image size should be less than 5MB.')
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
            onUploadComplete(publicUrl)

        } catch (error: any) {
            console.error('Upload error:', error)
            setErrorMsg(error.message || 'Failed to upload image. Please ensure the storage bucket exists and is public.')
        } finally {
            setIsUploading(false)
            // Reset input so the same file could be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const clearPreview = () => {
        setPreviewUrl(null)
        onUploadComplete('')
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
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video max-w-sm flex items-center justify-center group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={previewUrl} 
                            alt="Upload preview" 
                            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50" 
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <button
                                type="button"
                                onClick={clearPreview}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                title="Remove Image"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                            <span className="text-white text-xs font-bold mt-2 tracking-wide uppercase">Remove</span>
                        </div>
                    </div>
                ) : (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {isUploading ? (
                            <div className="flex flex-col items-center justify-center text-indigo-600">
                                <Loader2 size={32} className="animate-spin mb-3" />
                                <span className="text-sm font-bold">Uploading...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-500 hover:text-indigo-600 transition-colors">
                                <UploadCloud size={40} className="mb-3" strokeWidth={1.5} />
                                <span className="text-sm font-bold text-gray-700 mb-1">Click to upload an image</span>
                                <span className="text-xs font-medium">SVG, PNG, JPG or GIF (max. 5MB)</span>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                            disabled={isUploading}
                        />
                    </div>
                )}
            </div>
            
            <p className="text-xs text-gray-400 font-medium mt-1">
                Files are uploaded directly to the <span className="font-mono text-gray-500">{bucketName}</span> storage bucket.
            </p>
        </div>
    )
}
