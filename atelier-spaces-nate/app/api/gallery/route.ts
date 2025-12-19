import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    console.log('🔄 Fetching gallery items...')
    
    const { data, error } = await (supabaseAdmin
      .from('gallery') as any)
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Database error fetching gallery:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch gallery items', 
          details: error.message,
          code: error.code 
        }, 
        { status: 500 }
      )
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} gallery items`)
    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('❌ Unexpected error in gallery GET:', error)
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while fetching gallery', 
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('🎯 Creating new gallery item...')
    
    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid request body. Must be valid JSON.' },
        { status: 400 }
      )
    }

    const { title, description, image_url, category, order_position, is_active } = body

    // Comprehensive validation
    const errors: string[] = []
    if (!title || title.trim().length === 0) {
      errors.push('Title is required and cannot be empty')
    }
    if (title && title.length > 255) {
      errors.push('Title must be 255 characters or less')
    }
    if (!image_url || image_url.trim().length === 0) {
      errors.push('Image URL is required')
    }
    if (order_position !== undefined && (isNaN(order_position) || order_position < 0)) {
      errors.push('Order position must be a non-negative number')
    }

    if (errors.length > 0) {
      console.error('❌ Validation errors:', errors)
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    console.log('📝 Inserting gallery item:', { title, category })

    const { data, error } = await (supabaseAdmin
      .from('gallery') as any)
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        image_url: image_url.trim(),
        category: category?.trim() || null,
        order_position: order_position || 0,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Database error creating gallery item:', error)
      return NextResponse.json(
        { 
          error: 'Failed to create gallery item', 
          details: error.message,
          code: error.code 
        }, 
        { status: 500 }
      )
    }

    console.log('✅ Gallery item created successfully:', data.id)
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('❌ Unexpected error in gallery POST:', error)
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while creating gallery item', 
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    console.log('🔄 Updating gallery item...')
    
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid request body. Must be valid JSON.' },
        { status: 400 }
      )
    }

    const { id, title, description, image_url, category, order_position, is_active } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Gallery item ID is required' }, 
        { status: 400 }
      )
    }

    console.log('📝 Updating gallery item:', id)

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
      console.error('❌ Database error updating gallery item:', error)
      
      // Check if item exists
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Gallery item not found', details: 'The specified item does not exist' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to update gallery item', 
          details: error.message,
          code: error.code 
        }, 
        { status: 500 }
      )
    }

    console.log('✅ Gallery item updated successfully')
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('❌ Unexpected error in gallery PUT:', error)
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while updating gallery item', 
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    console.log('🗑️ Deleting gallery item...')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Gallery item ID is required' }, 
        { status: 400 }
      )
    }

    console.log('📝 Deleting gallery item:', id)

    const { error } = await (supabaseAdmin
      .from('gallery') as any)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Database error deleting gallery item:', error)
      return NextResponse.json(
        { 
          error: 'Failed to delete gallery item', 
          details: error.message,
          code: error.code 
        }, 
        { status: 500 }
      )
    }

    console.log('✅ Gallery item deleted successfully')
    return NextResponse.json({ success: true, message: 'Gallery item deleted successfully' })
  } catch (error: any) {
    console.error('❌ Unexpected error in gallery DELETE:', error)
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while deleting gallery item', 
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}
