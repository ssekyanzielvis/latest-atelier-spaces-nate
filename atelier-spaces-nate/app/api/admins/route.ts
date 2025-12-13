import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase/server'

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

    // Hash password
    const passwordHash = await hash(password, 10)

    // Create new admin user
    const { data: newAdmin, error: insertError } = await supabaseAdmin
      .from('admins')
      .insert([
        {
          username,
          email,
          password_hash: passwordHash,
          full_name,
          role: role || 'admin',
          is_active: true,
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating admin:', insertError)
      return NextResponse.json(
        { error: 'Failed to create admin user' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Admin user created successfully',
        admin: {
          id: newAdmin.id,
          username: newAdmin.username,
          email: newAdmin.email,
          full_name: newAdmin.full_name,
          role: newAdmin.role,
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

    const updateData: any = {
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

    const { data: updatedAdmin, error: updateError } = await supabaseAdmin
      .from('admins')
      .update(updateData)
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

    return NextResponse.json(
      {
        message: 'Admin user updated successfully',
        admin: {
          id: updatedAdmin.id,
          username: updatedAdmin.username,
          email: updatedAdmin.email,
          full_name: updatedAdmin.full_name,
          role: updatedAdmin.role,
          is_active: updatedAdmin.is_active,
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
