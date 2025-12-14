import { supabaseAdmin } from './server'

// Storage buckets for each section
const STORAGE_BUCKETS = {
  HERO_SLIDES: 'hero-slides',
  PROJECTS: 'projects',
  NEWS: 'news',
  WORKS: 'works',
  TEAM: 'team',
  ABOUT: 'about',
  SLOGAN: 'slogan',
  COLLABORATIONS: 'collaborations',
} as const

// Map folder names to bucket names
const FOLDER_TO_BUCKET: Record<string, string> = {
  'hero-slides': STORAGE_BUCKETS.HERO_SLIDES,
  'projects': STORAGE_BUCKETS.PROJECTS,
  'news': STORAGE_BUCKETS.NEWS,
  'works': STORAGE_BUCKETS.WORKS,
  'team': STORAGE_BUCKETS.TEAM,
  'about': STORAGE_BUCKETS.ABOUT,
  'slogan': STORAGE_BUCKETS.SLOGAN,
  'collaborations': STORAGE_BUCKETS.COLLABORATIONS,
}

export async function uploadImage(file: File, folder: string = 'general'): Promise<string> {
  const bucketName = FOLDER_TO_BUCKET[folder] || STORAGE_BUCKETS.COLLABORATIONS
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  console.log(`Uploading to bucket: ${bucketName}, file: ${fileName}`)

  const { data, error } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error(`Upload error to ${bucketName}:`, error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  console.log(`File uploaded successfully: ${data.path}`)

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucketName)
    .getPublicUrl(data.path)

  console.log(`Public URL: ${publicUrl}`)
  return publicUrl
}

export async function deleteImage(url: string, folder: string = 'general'): Promise<void> {
  const bucketName = FOLDER_TO_BUCKET[folder] || STORAGE_BUCKETS.COLLABORATIONS
  
  // Extract file path from URL
  const pathMatch = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/)
  if (!pathMatch) {
    console.warn(`Could not extract path from URL: ${url}`)
    return
  }
  
  const filePath = pathMatch[1]

  console.log(`Deleting from bucket: ${bucketName}, file: ${filePath}`)

  const { error } = await supabaseAdmin.storage
    .from(bucketName)
    .remove([filePath])

  if (error) {
    console.error(`Delete error from ${bucketName}:`, error)
    throw new Error(`Failed to delete image: ${error.message}`)
  }

  console.log(`File deleted successfully: ${filePath}`)
}

export async function uploadMultipleImages(files: File[], folder: string = 'general'): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file, folder))
  return Promise.all(uploadPromises)
}
