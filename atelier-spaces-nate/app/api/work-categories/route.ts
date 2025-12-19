import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type WorkCategory = Database['public']['Tables']['work_categories']['Row']
type WorkCategoryInsert = Database['public']['Tables']['work_categories']['Insert']
type WorkCategoryUpdate = Database['public']['Tables']['work_categories']['Update']

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const includeInactive = searchParams.get('includeInactive') === 'true'

    if (id) {
      // Get single category
      const { data, error } = await supabaseAdmin
        .from('work_categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Work category GET single error:', error)
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    } else {
      // Get all categories
      let query = supabaseAdmin
        .from('work_categories')
        .select('*')

      if (!includeInactive) {
        query = query.eq('is_active', true)
      }

      const { data, error } = await query.order('order_position', { ascending: true })

      if (error) {
        console.error('Work categories GET all error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch categories' },
          { status: 500 }
        )
      }

      return NextResponse.json(data || [])
    }
  } catch (error) {
    console.error('Work categories GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, slug, cover_image, cover_media, media_type, order_position = 0 } = body

    // Support both old (cover_image) and new (cover_media) field names for backward compatibility
    const finalCoverMedia = cover_media || cover_image
    const finalMediaType = media_type || 'image'

    // Validate input
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Validate media type
    if (finalMediaType && !['image', 'video'].includes(finalMediaType)) {
      return NextResponse.json(
        { error: 'Invalid media type. Must be "image" or "video"' },
        { status: 400 }
      )
    }

    // Create slug from name if not provided
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-')

    // Create category
    const { data, error } = await (supabaseAdmin
      .from('work_categories') as any)
      .insert({
        name,
        description: description || null,
        slug: finalSlug,
        cover_image: finalCoverMedia || null,
        cover_media: finalCoverMedia || null,
        media_type: finalMediaType,
        order_position,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Work category creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Category created successfully',
        data,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Work categories POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, slug, cover_image, cover_media, media_type, order_position, is_active } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Validate media type if provided
    if (media_type && !['image', 'video'].includes(media_type)) {
      return NextResponse.json(
        { error: 'Invalid media type. Must be "image" or "video"' },
        { status: 400 }
      )
    }

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (slug !== undefined) updateData.slug = slug
    if (cover_image !== undefined) {
      updateData.cover_image = cover_image
      updateData.cover_media = cover_image
    }
    if (cover_media !== undefined) {
      updateData.cover_media = cover_media
      updateData.cover_image = cover_media
    }
    if (media_type !== undefined) updateData.media_type = media_type
    if (order_position !== undefined) updateData.order_position = order_position
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await (supabaseAdmin
      .from('work_categories') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Work category update error:', error)
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Category updated successfully',
      data,
    })
  } catch (error) {
    console.error('Work categories PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Get category to find cover image
    const { data: category, error: fetchError } = await supabaseAdmin
      .from('work_categories')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Delete cover media from storage if it exists
    const coverMediaUrl = (category as any).cover_media || (category as any).cover_image
    if (category && coverMediaUrl) {
      try {
        const fileName = coverMediaUrl.split('/').pop()
        if (fileName) {
          await supabaseAdmin.storage
            .from('work-categories')
            .remove([fileName])
        }
      } catch (storageError) {
        console.error('Error deleting cover media:', storageError)
        // Continue with deletion even if media delete fails
      }
    }

    // Delete category
    const { error } = await supabaseAdmin
      .from('work_categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Work category delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Category deleted successfully',
    })
  } catch (error) {
    console.error('Work categories DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
