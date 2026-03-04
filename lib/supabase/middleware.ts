import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
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

    // IMPORTANT: Do not write any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard
    // to debug issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected Routes Check
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup') ||
        request.nextUrl.pathname.startsWith('/auth')
    const isPublicPage = request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/privacy-policy') ||
        request.nextUrl.pathname.startsWith('/terms-of-service')
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin')

    // 1. Unauthenticated users trying to access protected routes
    if (!user && !isAuthPage && !isPublicPage) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 2. Authenticated users validation
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, account_status, is_approved')
            .eq('id', user.id)
            .single()

        // Block suspended or unapproved users from everything except maybe public pages?
        // Actually, for now, let's enforce based on the requested route.

        if (isAdminPage) {
            if (profile?.role !== 'admin' || profile?.account_status !== 'active' || !profile?.is_approved) {
                const url = request.nextUrl.clone()
                url.pathname = '/unauthorized'
                return NextResponse.redirect(url)
            }
        }
    }

    return supabaseResponse
}
