import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Check news articles
    const { data: newsData, error: newsError } = await supabaseAdmin
      .from('news_articles')
      .select('id, title, image') as any

    // Check projects
    const { data: projectsData, error: projectsError } = await supabaseAdmin
      .from('projects')
      .select('id, title, image') as any

    // Check works
    const { data: worksData, error: worksError } = await supabaseAdmin
      .from('works')
      .select('id, title, image') as any

    // Check team members
    const { data: teamData, error: teamError } = await supabaseAdmin
      .from('team_members')
      .select('id, name, image') as any

    return NextResponse.json({
      debug: {
        news: {
          error: newsError?.message,
          count: newsData?.length || 0,
          samples: (newsData || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            hasImage: !!item.image,
            image: item.image,
          })),
        },
        projects: {
          error: projectsError?.message,
          count: projectsData?.length || 0,
          samples: (projectsData || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            hasImage: !!item.image,
            image: item.image,
          })),
        },
        works: {
          error: worksError?.message,
          count: worksData?.length || 0,
          samples: (worksData || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            hasImage: !!item.image,
            image: item.image,
          })),
        },
        team: {
          error: teamError?.message,
          count: teamData?.length || 0,
          samples: (teamData || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            hasImage: !!item.image,
            image: item.image,
          })),
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
