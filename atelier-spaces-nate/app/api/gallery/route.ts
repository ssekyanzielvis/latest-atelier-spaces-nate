import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { data, error } = await (supabaseAdmin
      .from('gallery') as any)
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching gallery:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('Error in gallery GET:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, image_url, category, order_position, is_active } = body

    // Validation
    if (!title || !image_url) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      )
    }

    const { data, error } = await (supabaseAdmin
      .from('gallery') as any)
      .insert({
        title,
        description: description || null,
        image_url,
        category: category || null,
        order_position: order_position || 0,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating gallery item:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Error in gallery POST:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, image_url, category, order_position, is_active } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { data, error } = await (supabaseAdmin
      .from('gallery') as any)
      .update({
        title,
        description,
        image_url,
        category,
        order_position,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating gallery item:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in gallery PUT:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await (supabaseAdmin
      .from('gallery') as any)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting gallery item:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in gallery DELETE:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
