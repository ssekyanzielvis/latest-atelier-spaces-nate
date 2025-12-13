import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase/server'
import { createAuthUser, updateUserPassword } from '@/lib/supabase/auth'
import { Database } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, full_name, role } = body

    // Validate required fields
    if (!username || !email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const { data: existingUser } = await supabaseAdmin
      .from('admins')
      .select('username')
      .eq('username', username)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingEmail } = await supabaseAdmin
      .from('admins')
      .select('email')
      .eq('email', email)
      .single()

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Create Supabase Auth user first
    const { data: authData, error: authError } = await createAuthUser(
      email,
      password,
      {
        username,
        full_name,
        role: role || 'admin',
      }
    )

    if (authError) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json(
        { error: 'Failed to create authentication user' },
        { status: 500 }
      )
    }

    // Hash password for admins table
    const passwordHash = await hash(password, 10)

    // Create admin record in admins table
    type AdminInsert = Database['public']['Tables']['admins']['Insert']
    const insertData: AdminInsert = {
      id: authData.user!.id, // Use the same ID as Supabase Auth user
      username,
      email,
      password_hash: passwordHash,
      full_name,
      role: role || 'admin',
      is_active: true,
    }

    const { data: newAdmin, error: insertError } = await supabaseAdmin
      .from('admins')
      .insert(insertData as any)
      .select()
      .single()

    if (insertError) {
      console.error('Error creating admin:', insertError)
      return NextResponse.json(
        { error: 'Failed to create admin user' },
        { status: 500 }
      )
    }

    type AdminRow = Database['public']['Tables']['admins']['Row']
    const admin = newAdmin as AdminRow

    return NextResponse.json(
      { 
        message: 'Admin user created successfully',
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          full_name: admin.full_name,
          role: admin.role,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in admin creation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, username, email, password, full_name, role, is_active } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      )
    }

    type AdminUpdate = Database['public']['Tables']['admins']['Update']
    const updateData: AdminUpdate = {
      updated_at: new Date().toISOString(),
    }

    if (username) updateData.username = username
    if (email) updateData.email = email
    if (full_name !== undefined) updateData.full_name = full_name
    if (role) updateData.role = role
    if (is_active !== undefined) updateData.is_active = is_active

    // Hash new password if provided
    if (password) {
      updateData.password_hash = await hash(password, 10)
    }

    const { data: updatedAdmin, error: updateError } = await (supabaseAdmin
      .from('admins') as any)
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating admin:', updateError)
      return NextResponse.json(
        { error: 'Failed to update admin user' },
        { status: 500 }
      )
    }

    type AdminRow = Database['public']['Tables']['admins']['Row']
    const admin = updatedAdmin as AdminRow

    return NextResponse.json(
      {
        message: 'Admin user updated successfully',
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          full_name: admin.full_name,
          role: admin.role,
          is_active: admin.is_active,
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in admin update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
