import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Create a supabase client specifically for the middleware
    // Custom fetch with timeout to prevent 30s+ hangs when Supabase is unreachable
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                fetch: (url, options) => {
                    const controller = new AbortController()
                    const timeoutId = setTimeout(() => controller.abort(), 5000)
                    return fetch(url, {
                        ...options,
                        signal: controller.signal,
                    }).finally(() => clearTimeout(timeoutId))
                },
            },
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh auth token - wrapped in try-catch so network failures don't block page loads
    let user = null
    try {
        const { data } = await supabase.auth.getUser()
        user = data?.user ?? null
    } catch (error) {
        // If Supabase is unreachable, treat as unauthenticated and continue
        console.warn('Supabase auth check failed (network issue?):', error instanceof Error ? error.message : 'Unknown error')
    }

    const currentPath = request.nextUrl.pathname

    // Redirect Logic based on authentication status and path
    const isAuthRoute = currentPath.startsWith('/login') || currentPath.startsWith('/signup')
    const isStudentRoute = currentPath.startsWith('/student')
    const isAdminRoute = currentPath.startsWith('/admin')

    // Not logged in -> kick to login if trying to access protected routes
    // [Prototype Mode] Temporarily allowing unauthenticated access to /admin for easier testing
    if (!user && isStudentRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Logged in
    if (user) {
        const role = user.user_metadata?.role || 'student'

        // Kick from auth pages to their respective dashboard
        if (isAuthRoute || currentPath === '/') {
            const url = request.nextUrl.clone()
            url.pathname = role === 'admin' ? '/admin/dashboard' : '/student/dashboard'
            return NextResponse.redirect(url)
        }

        // Role-based protection
        // [Prototype Mode] Temporarily bypassing strict role checks so we can test the admin panel easily
        /*
        if (role === 'student' && isAdminRoute) {
            // Students can't access admin
            const url = request.nextUrl.clone()
            url.pathname = '/student/dashboard'
            return NextResponse.redirect(url)
        }
        */
    }

    return supabaseResponse
}
