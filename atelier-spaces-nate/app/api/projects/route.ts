import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const published = searchParams.get('published') === 'true'

    if (id) {
      // Get single project by ID
      const { data, error } = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      return NextResponse.json({ data })
    }

    // Get all projects or published only
    let query = supabaseAdmin.from('projects').select('*')
    
    if (published) {
      query = query.eq('is_published', true)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Projects GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json()

    // Validate required fields
    if (!body.title || !body.slug || !body.location || !body.description || !body.image) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, location, description, image' },
        { status: 400 }
      )
    }

    console.log('Creating project:', { title: body.title, slug: body.slug })

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        title: body.title,
        slug: body.slug,
        location: body.location,
        description: body.description,
        client: body.client || null,
        year: body.year ? parseInt(body.year) : null,
        designer: body.designer || null,
        duration: body.duration || null,
        image: body.image,
        other_info: body.other_info || null,
        featured: body.featured || false,
        is_published: body.is_published !== false,
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Projects POST error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create project' },
        { status: 400 }
      )
    }

    console.log('Project created successfully')
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Projects POST exception:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const body: any = await request.json()

    console.log('Updating project:', id)

    const { data, error } = await (supabaseAdmin
      .from('projects') as any)
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Projects PUT error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Project updated successfully:', id)
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Projects PUT exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    console.log('Deleting project:', id)

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Projects DELETE error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Project deleted successfully:', id)
    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    console.error('Projects DELETE exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
