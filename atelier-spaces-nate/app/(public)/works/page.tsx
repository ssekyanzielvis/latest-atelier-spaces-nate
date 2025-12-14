import { supabaseAdmin } from '@/lib/supabase/server'
import { Work } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 0

async function getWorks(): Promise<Work[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('works')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching works:', error)
      return []
    }

    console.log('Fetched works:', data)
    return (data as Work[]) || []
  } catch (err) {
    console.error('Exception fetching works:', err)
    return []
  }
}

export const metadata = {
  title: 'Works | Atelier',
  description: 'Explore our creative works and designs',
}

export default async function WorksPage() {
  const works = await getWorks()

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Works</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A showcase of our creative designs and artistic endeavors
          </p>
        </div>

        {works.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((work) => (
              <Link key={work.id} href={`/works/${work.slug}`} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {work.title}
                  </h3>
                  {work.client && (
                    <p className="text-sm text-muted-foreground mt-1">{work.client}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No works available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
