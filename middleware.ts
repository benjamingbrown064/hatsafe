import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

  // IMPORTANT: do not run code between createServerClient and auth.getUser()
  const { data: { user } } = await supabase.auth.getUser()

  // Public routes that don't require auth
  const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/reset-password']
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/'))

  // API routes: pass through always (each route handles its own auth)
  if (isApiRoute) {
    return supabaseResponse
  }

  // Protected page routes: redirect to login if not authenticated
  if (!user && !isPublicPath) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in, trying to access login/signup: redirect to dashboard
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
