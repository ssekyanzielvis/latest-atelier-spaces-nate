import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { uploadImage } from '@/lib/supabase/storage'

export async function POST(request: NextRequest) {
  try {
    // Check for authentication cookie
    const hasAuth = request.cookies.get('sb-access-token') ||
                    request.cookies.get('sb:access-token') ||
                    request.cookies.get('supabase-auth-token')
    
    if (!hasAuth) {
      return NextResponse.json({ error: 'Unauthorized - please login first' }, { status: 401 })
    }
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'general'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    // Validate file type (images and videos)
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'File must be an image or video' }, { status: 400 })
    }
    
    // Validate file size (100MB max for videos, 10MB max for images)
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeLabel = isVideo ? '100MB' : '10MB'
      return NextResponse.json({ error: `File too large (max ${maxSizeLabel})` }, { status: 400 })
    }
    
    const url = await uploadImage(file, folder)
    
    return NextResponse.json({ url }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    )
  }
}
