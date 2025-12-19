import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('🔍 Fetching gallery item:', id)

    const { data, error } = await (supabaseAdmin
      .from('gallery') as any)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('❌ Error fetching gallery item:', error)
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Gallery item not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Gallery item fetched successfully')
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery item' },
      { status: 500 }
    )
  }
}
