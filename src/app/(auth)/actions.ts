'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error, data: authData } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return redirect(`/login?error=${error.message}`)
    }

    // Redirect based on role
    const role = authData.user?.user_metadata?.role || 'student'
    redirect(role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('full_name') as string,
                role: 'student', // Default role for new signups
            },
        },
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        return redirect(`/signup?error=${error.message}`)
    }

    redirect('/login?message=Check your email to verify your account')
}
