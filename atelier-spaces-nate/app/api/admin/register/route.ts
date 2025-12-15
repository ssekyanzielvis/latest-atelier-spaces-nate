import { NextResponse } from 'next/server'
import { getSupabaseAuthAdmin } from '@/lib/supabase/auth'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body: any = await request.json()

    const { email, password, fullName } = body

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    console.log('Creating new admin account:', email)

    // Create Supabase auth user
    const authAdmin = getSupabaseAuthAdmin()
    const { data: authData, error: authError } = await authAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (authError || !authData.user) {
      console.error('Auth creation error:', authError)
      return NextResponse.json(
        { error: authError?.message || 'Failed to create user' },
        { status: 500 }
      )
    }

    console.log('Auth user created:', authData.user.id)

    // Add to admins table
    const { data: adminData, error: adminError } = (await (supabaseAdmin
      .from('admins') as any)
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        is_active: true,
        role: 'admin',
      })
      .select()
      .single()) as any

    if (adminError) {
      console.error('Admin table error:', adminError)
      
      // Cleanup: Delete the auth user if admin insertion fails
      await authAdmin.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json(
        { error: adminError.message || 'Failed to create admin record' },
        { status: 500 }
      )
    }

    const admin = adminData as any

    console.log('Admin registered successfully:', admin.id)

    return NextResponse.json(
      {
        success: true,
        message: 'Admin registered successfully',
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.full_name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
