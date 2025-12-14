import { supabaseAdmin } from '@/lib/supabase/server'
import ProjectCard from '@/components/public/ProjectCard'
import { Project } from '@/types'

export const revalidate = 0

async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }

    console.log('Fetched projects:', data)
    if (data && data.length > 0) {
      console.log('First project:', {
        id: data[0].id,
        title: data[0].title,
        hasImage: !!data[0].image,
        image: data[0].image,
      })
    }
    return (data as Project[]) || []
  } catch (err) {
    console.error('Exception fetching projects:', err)
    return []
  }
}

export const metadata = {
  title: 'Projects | Atelier',
  description: 'Explore our architectural projects',
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover our portfolio of innovative architectural solutions
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No projects available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
