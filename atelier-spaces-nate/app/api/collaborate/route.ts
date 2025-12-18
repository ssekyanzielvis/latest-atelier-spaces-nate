import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { collaborationSchema } from '@/lib/validations'
import type { Database } from '@/types/database'

type CollaborationInsert = Database['public']['Tables']['collaborations']['Insert']

// GET - Fetch all collaboration requests (admin only)
export async function GET(request: Request) {
  try {
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
