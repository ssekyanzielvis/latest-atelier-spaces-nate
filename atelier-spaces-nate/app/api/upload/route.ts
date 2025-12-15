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
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
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
