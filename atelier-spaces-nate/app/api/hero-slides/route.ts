import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .select('*')
      .order('order_position', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json()

    console.log('Creating hero slide with data:', body)

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!body.image) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    // Prepare the insert data
    const insertData = {
      title: body.title,
      subtitle: body.subtitle || null,
      image: body.image,
      cta_text: body.cta_text || null,
      cta_link: body.cta_link || null,
      order_position: body.order_position || 1,
      is_active: body.is_active !== false, // Default to true
    }

    console.log('Insert data:', insertData)

    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Error creating hero slide:', error)
      console.error('Error code:', error.code)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      
      // More specific error messages
      if (error.code === 'PGRST001') {
        return NextResponse.json({ 
          error: 'Permission denied. Please run the RLS fix SQL script in Supabase: scripts/HERO_SLIDES_RLS_FIX.sql' 
        }, { status: 403 })
      }
      
      return NextResponse.json({ 
        error: error.message || 'Failed to create hero slide' 
      }, { status: 500 })
    }

    console.log('Hero slide created successfully:', data)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Exception in hero slides POST:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
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

    const { data, error } = (await (supabaseAdmin
      .from('hero_slides') as any)
      .update(body)
      .eq('id', id)
      .select()
      .single()) as any

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('hero_slides')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
