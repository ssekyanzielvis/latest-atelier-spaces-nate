import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { collaborationSchema } from '@/lib/validations'
import type { Database } from '@/types/database'

type CollaborationInsert = Database['public']['Tables']['collaborations']['Insert']

// GET - Fetch all collaborations or a single one by ID (admin only)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Fetch single collaboration by ID
      console.log('📥 Fetching collaboration:', id)

      const { data, error } = await supabaseAdmin
        .from('collaborations')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ Database error:', error)
        return NextResponse.json(
          { error: error.code === 'PGRST116' ? 'Collaboration not found' : `Database error: ${error.message}` },
          { status: error.code === 'PGRST116' ? 404 : 500 }
        )
      }

      console.log('✅ Found collaboration')
      return NextResponse.json({ data })
    } else {
      // Fetch all collaborations
      console.log('📥 Fetching all collaborations...')

      const { data, error } = await supabaseAdmin
        .from('collaborations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Database error:', error)
        return NextResponse.json(
          { error: `Database error: ${error.message}` },
          { status: 500 }
        )
      }

      console.log(`✅ Found ${data?.length || 0} collaborations`)
      return NextResponse.json({ data })
    }
  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch collaborations' },
      { status: 500 }
    )
  }
}

// POST - Submit a new collaboration request (public)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = collaborationSchema.parse(body)
    
    // Prepare insert data matching the database schema exactly
    const insertData: CollaborationInsert = {
      name: validatedData.name,
      description: validatedData.description,
      email: validatedData.email,
      company: validatedData.company || null,
      phone: validatedData.phone || null,
      project_type: validatedData.project_type || null,
      budget: validatedData.budget || null,
      message: validatedData.message,
      status: 'new'
    }

    // Insert into database using admin client for insert permissions
    const { data, error } = await supabaseAdmin
      .from('collaborations')
      // @ts-expect-error - Supabase type inference issue with RLS policies
      .insert(insertData)
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to submit collaboration request' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

// PUT - Update collaboration status (admin only)
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Collaboration ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    console.log('🔄 Updating collaboration status:', id, 'to', status)

    const { data, error } = await supabaseAdmin
      .from('collaborations')
      // @ts-expect-error - Supabase type inference issue
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: `Failed to update: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('✅ Collaboration updated')
    return NextResponse.json({ data })
  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update collaboration' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a collaboration request (admin only)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Collaboration ID is required' },
        { status: 400 }
      )
    }

    console.log('🗑️ Deleting collaboration:', id)

    const { error } = await supabaseAdmin
      .from('collaborations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: `Failed to delete: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('✅ Collaboration deleted')
    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete collaboration' },
      { status: 500 }
    )
  }
}
