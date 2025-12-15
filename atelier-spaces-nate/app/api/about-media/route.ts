import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type AboutMedia = Database['public']['Tables']['about_media']['Row']
type AboutMediaInsert = Database['public']['Tables']['about_media']['Insert']
type AboutMediaUpdate = Database['public']['Tables']['about_media']['Update']

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get single media item
      const { data, error } = await supabaseAdmin
        .from('about_media')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Media item not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    } else {
      // Get all active media items
      const { data, error } = await supabaseAdmin
        .from('about_media')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch media items' },
          { status: 500 }
        )
      }

      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('About media GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, caption, file_url, file_type, order_position = 0 } = body

    // Validate input
    if (!title || !caption || !file_url || !file_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['image', 'video'].includes(file_type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be "image" or "video"' },
        { status: 400 }
      )
    }

    // Create media item
    const { data, error } = await (supabaseAdmin
      .from('about_media') as any)
      .insert({
        title,
        caption,
        file_url,
        file_type,
        order_position,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('About media creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create media item' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Media item created successfully',
        data,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('About media POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, caption, file_url, file_type, order_position, is_active } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Media ID is required' },
        { status: 400 }
      )
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (title !== undefined) updateData.title = title
    if (caption !== undefined) updateData.caption = caption
    if (file_url !== undefined) updateData.file_url = file_url
    if (file_type !== undefined) {
      if (!['image', 'video'].includes(file_type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Must be "image" or "video"' },
          { status: 400 }
        )
      }
      updateData.file_type = file_type
    }
    if (order_position !== undefined) updateData.order_position = order_position
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await (supabaseAdmin
      .from('about_media') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('About media update error:', error)
      return NextResponse.json(
        { error: 'Failed to update media item' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Media item updated successfully',
        data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('About media PATCH error:', error)
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
        { error: 'Media ID is required' },
        { status: 400 }
      )
    }

    // Get the media item first to get file_url
    const { data: mediaItem } = await supabaseAdmin
      .from('about_media')
      .select('file_url')
      .eq('id', id)
      .single() as { data: Pick<AboutMedia, 'file_url'> | null }

    // Delete from database
    const { error } = await supabaseAdmin
      .from('about_media')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('About media delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete media item' },
        { status: 500 }
      )
    }

    // Delete file from storage if it exists
    if (mediaItem?.file_url) {
      try {
        const bucket = 'about-media'
        const filePath = mediaItem.file_url.split(`${bucket}/`)[1]
        
        if (filePath) {
          await supabaseAdmin.storage.from(bucket).remove([filePath])
        }
      } catch (err) {
        console.error('Error deleting storage file:', err)
        // Don't fail the request if storage deletion fails
      }
    }

    return NextResponse.json(
      { message: 'Media item deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('About media DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
