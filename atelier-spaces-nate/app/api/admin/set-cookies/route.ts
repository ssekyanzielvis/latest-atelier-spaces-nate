import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { accessToken, refreshToken } = body

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Missing access token' },
        { status: 400 }
      )
    }

    console.log('[COOKIE-API] Setting auth cookies with tokens')
    
    const cookieStore = await cookies()

    // Set access token cookie
    cookieStore.set('sb-access-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    console.log('[COOKIE-API] Access token cookie set')

    // Set refresh token if provided
    if (refreshToken) {
      cookieStore.set('sb-refresh-token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
      console.log('[COOKIE-API] Refresh token cookie set')
    }

    return NextResponse.json(
      { success: true, message: 'Cookies set successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[COOKIE-API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to set cookies' },
      { status: 500 }
    )
  }
}
