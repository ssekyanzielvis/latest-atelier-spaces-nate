import { supabaseAdmin } from './server'

const BUCKET_NAME = 'atelier-media'

export async function uploadImage(file: File, folder: string = 'general'): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  return publicUrl
}

export async function deleteImage(url: string): Promise<void> {
  const path = url.split(`${BUCKET_NAME}/`)[1]
  if (!path) return

  const { error } = await supabaseAdmin.storage.from(BUCKET_NAME).remove([path])

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

export async function uploadMultipleImages(files: File[], folder: string = 'general'): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file, folder))
  return Promise.all(uploadPromises)
}
