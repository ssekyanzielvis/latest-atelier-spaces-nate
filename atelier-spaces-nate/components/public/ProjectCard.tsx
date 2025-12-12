import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white text-sm font-medium">View Project</p>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        {project.location && (
          <p className="text-sm text-muted-foreground mt-1">{project.location}</p>
        )}
      </div>
    </Link>
  )
}
