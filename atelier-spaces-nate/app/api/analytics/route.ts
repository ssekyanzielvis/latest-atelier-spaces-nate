import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page_path } = body

    // Get visitor info
    const visitor_ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const user_agent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || request.headers.get('referrer') || 'direct'

    // Record the visit
    const { error: insertError } = await (supabaseAdmin
      .from('site_analytics') as any)
      .insert({
        page_path,
        visitor_ip,
        user_agent,
        referrer
      })

    if (insertError) {
      console.error('Error recording visit:', insertError)
      return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 })
    }

    // Update daily summary
    const today = new Date().toISOString().split('T')[0]
    
    // Get today's stats
    const { data: todayStats } = await (supabaseAdmin
      .from('site_analytics') as any)
      .select('visitor_ip')
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`)

    const total_visits = todayStats?.length || 0
    const unique_visitors = new Set(todayStats?.map((s: any) => s.visitor_ip)).size

    // Upsert summary
    await (supabaseAdmin
      .from('site_analytics_summary') as any)
      .upsert({
        date: today,
        total_visits,
        unique_visitors,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'date'
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7' // Default to 7 days

    // Get total visits
    const { count: totalVisits } = await (supabaseAdmin
      .from('site_analytics') as any)
      .select('*', { count: 'exact', head: true })

    // Get today's visits
    const today = new Date().toISOString().split('T')[0]
    const { count: todayVisits } = await (supabaseAdmin
      .from('site_analytics') as any)
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`)

    // Get unique visitors today
    const { data: todayData } = await (supabaseAdmin
      .from('site_analytics') as any)
      .select('visitor_ip')
      .gte('created_at', `${today}T00:00:00`)

    const uniqueVisitorsToday = new Set(todayData?.map((d: any) => d.visitor_ip)).size

    // Get last N days summary
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - parseInt(range))
    
    const { data: summary } = await (supabaseAdmin
      .from('site_analytics_summary') as any)
      .select('*')
      .gte('date', daysAgo.toISOString().split('T')[0])
      .order('date', { ascending: false })

    // Get most visited pages
    const { data: pageVisits } = await (supabaseAdmin
      .from('site_analytics') as any)
      .select('page_path')
      .gte('created_at', `${today}T00:00:00`)

    const pageCounts: Record<string, number> = {}
    pageVisits?.forEach((p: any) => {
      pageCounts[p.page_path] = (pageCounts[p.page_path] || 0) + 1
    })

    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }))

    return NextResponse.json({
      totalVisits: totalVisits || 0,
      todayVisits: todayVisits || 0,
      uniqueVisitorsToday: uniqueVisitorsToday || 0,
      summary: summary || [],
      topPages: topPages || []
    })
  } catch (error) {
    console.error('Analytics GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
