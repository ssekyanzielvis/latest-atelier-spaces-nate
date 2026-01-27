import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET - Fetch active Moon Voyage content
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const admin = searchParams.get('admin') === 'true'

        let data: any
        let error: any

        if (id) {
            // Fetch specific item by ID (for edit page)
            const result = await supabaseAdmin
                .from('moon_voyage')
                .select('*')
                .eq('id', id)
                .single()
            data = result.data
            error = result.error
        } else if (admin) {
            // Fetch all items for admin list
            const result = await supabaseAdmin
                .from('moon_voyage')
                .select('*')
                .order('created_at', { ascending: false })
            data = result.data
            error = result.error
        } else {
            // Default: Fetch single active item for visitor page
            const result = await supabaseAdmin
                .from('moon_voyage')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()
            data = result.data
            error = result.error
        }

        if (error) {
            // Ignore "Row not found" for default public view
            if (error.code === 'PGRST116' && !id && !admin) {
                return NextResponse.json(null)
            }
            console.error('Error fetching moon voyage:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch moon voyage content' },
            { status: 500 }
        )
    }
}

// POST - Create new Moon Voyage entry (admin only)
export async function POST(request: Request) {
    try {

        const body = await request.json()

        const { data, error } = await (supabaseAdmin
            .from('moon_voyage') as any)
            .insert([body])
            .select()
            .single()

        if (error) {
            console.error('Error creating moon voyage:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Failed to create moon voyage content' },
            { status: 500 }
        )
    }
}

// PUT - Update Moon Voyage entry (admin only)
export async function PUT(request: Request) {
    try {

        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        const { data, error } = await (supabaseAdmin
            .from('moon_voyage') as any)
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating moon voyage:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Failed to update moon voyage content' },
            { status: 500 }
        )
    }
}

// DELETE - Delete Moon Voyage entry (admin only)
export async function DELETE(request: Request) {
    try {

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        const { error } = await (supabaseAdmin
            .from('moon_voyage') as any)
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting moon voyage:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'Moon voyage deleted successfully' })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Failed to delete moon voyage content' },
            { status: 500 }
        )
    }
}
