'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, GraduationCap, LogOut, Loader2, ShieldCheck, Calendar, BookOpen } from 'lucide-react'

export default function StudentSettingsPage() {
    const router = useRouter()
    const supabase = createClient()

    const [isLoading, setIsLoading] = useState(true)
    const [isSigningOut, setIsSigningOut] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    setUserEmail(user.email ?? null)

                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single()

                    if (profileData) {
                        setProfile(profileData)
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserData()
    }, [supabase])

    const handleSignOut = async () => {
        setIsSigningOut(true)
        try {
            await supabase.auth.signOut()
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Error signing out:', error)
            setIsSigningOut(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 size={32} className="animate-spin text-primary-600" />
            </div>
        )
    }

    const getInitials = (name: string) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">Account Settings</h1>
                <p className="text-gray-500 font-medium text-sm lg:text-base">View your profile information and manage your account.</p>
            </div>

            <div className="flex justify-center mt-12">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-md w-full text-center">
                    <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-6">
                        <LogOut size={32} strokeWidth={2.5} className="-ml-1" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to leave?</h2>
                    <p className="text-sm font-medium text-gray-500 mb-8">
                        You can sign out of your student portal here. You will need to enter your credentials to access your dashboard again.
                    </p>

                    <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-bold transition-colors shadow-md shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                        {isSigningOut ? (
                            <><Loader2 size={18} className="animate-spin" /> Signing out...</>
                        ) : (
                            <>Sign Out of Portal</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
