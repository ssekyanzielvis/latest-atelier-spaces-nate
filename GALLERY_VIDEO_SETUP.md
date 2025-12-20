# Gallery Video Support Setup Guide

## Overview
The gallery system has been fully restructured to support both image and video uploads (MP4, WebM, MOV, AVI, MKV).

## Database Schema

### Gallery Table Structure
```sql
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,              -- URL to image or video
  media_type VARCHAR(20) DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  category VARCHAR(100),
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setup Instructions

### 1. Run Database Migration

Execute the migration script in Supabase SQL Editor:

```bash
# File location: scripts/gallery-video-migration.sql
```

This script will:
- Create the gallery table if it doesn't exist
- Add `media_type` column
- Rename `image_url` to `media_url` if needed
- Set up indexes and RLS policies
- Create auto-update triggers

### 2. Configure Storage Bucket

In Supabase Dashboard > Storage:

1. **Create/Verify 'gallery' bucket**
   - Name: `gallery`
   - Public: Yes

2. **Set up Storage Policies**

   **Policy 1: Public Read**
   ```
   Name: Public Access to Gallery
   Operation: SELECT
   Definition: (bucket_id = 'gallery')
   Roles: public
   ```

   **Policy 2: Authenticated Upload**
   ```
   Name: Authenticated users can upload to gallery
   Operation: INSERT
   Definition: (bucket_id = 'gallery' AND (auth.role() = 'authenticated'))
   Roles: authenticated
   ```

   **Policy 3: Authenticated Update**
   ```
   Name: Authenticated users can update gallery
   Operation: UPDATE
   Definition: (bucket_id = 'gallery' AND (auth.role() = 'authenticated'))
   Roles: authenticated
   ```

   **Policy 4: Authenticated Delete**
   ```
   Name: Authenticated users can delete from gallery
   Operation: DELETE
   Definition: (bucket_id = 'gallery' AND (auth.role() = 'authenticated'))
   Roles: authenticated
   ```

3. **Configure File Restrictions**
   - Allowed MIME types:
     - Images: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
     - Videos: `video/mp4`, `video/webm`, `video/quicktime`, `video/x-msvideo`, `video/x-matroska`
   - Max file size:
     - Images: 10MB
     - Videos: 100MB

## Features

### Supported File Types

**Images:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

**Videos:**
- MP4 (.mp4)
- WebM (.webm)
- QuickTime (.mov)
- AVI (.avi)
- Matroska (.mkv)

### Upload Process

1. Admin selects file through MediaUpload component
2. File is validated for type and size
3. File is uploaded to Supabase Storage 'gallery' bucket
4. Public URL is returned
5. Gallery item is created in database with media_url and media_type

### Display

- Images: Rendered with Next.js Image component (optimized)
- Videos: Rendered with HTML5 video element with controls
- Automatic media type detection based on `media_type` field

## Code Structure

### Type Definitions
```typescript
// types/database.ts
gallery: {
  Row: {
    id: string
    title: string
    description: string | null
    media_url: string
    media_type: 'image' | 'video'
    category: string | null
    order_position: number
    is_active: boolean
    created_at: string
    updated_at: string
  }
}
```

### Components

**MediaUpload Component** (`components/admin/MediaUpload.tsx`)
- Handles both image and video uploads
- Shows preview for uploaded media
- Validates file type and size
- Displays upload progress

**Gallery Display** (`app/(public)/gallery/page.tsx`)
- Fetches and displays gallery items
- Groups by category
- Renders videos with HTML5 video player
- Renders images with Next.js Image optimization

### API Routes

**POST /api/gallery**
- Creates new gallery item
- Validates media_url and media_type
- Supports backward compatibility with image_url field

**PUT /api/gallery**
- Updates existing gallery item
- Can update media_url and media_type

**DELETE /api/gallery/[id]**
- Deletes gallery item
- Removes associated media from storage

## Testing

### Test Video Upload

1. Login to admin panel (`/admin/login`)
2. Navigate to Gallery (`/admin/gallery`)
3. Click "Add New Gallery Item"
4. Upload a video file (MP4 recommended)
5. Fill in title and description
6. Save

### Verify Display

1. Navigate to public gallery (`/gallery`)
2. Verify video displays with controls
3. Test video playback
4. Check responsive layout

## Troubleshooting

### Video Won't Upload

**Check:**
1. File size (max 100MB)
2. File format (MP4, WebM, MOV, AVI, MKV)
3. Storage bucket exists and has correct policies
4. User is authenticated

**Solution:**
- Verify storage policies in Supabase Dashboard
- Check browser console for errors
- Ensure bucket name is 'gallery'

### Video Displays as Image

**Check:**
1. `media_type` field is set to 'video'
2. Database migration completed successfully

**Solution:**
- Update record: `UPDATE gallery SET media_type = 'video' WHERE id = 'your-id'`
- Re-upload the video through admin panel

### Storage Permission Errors

**Check:**
1. RLS policies are enabled on storage.objects
2. Authenticated role has INSERT, UPDATE, DELETE permissions
3. Public role has SELECT permission

**Solution:**
- Re-run storage policy setup
- Verify user authentication status

## Backward Compatibility

The system maintains backward compatibility:
- Accepts both `image_url` and `media_url` field names
- Defaults `media_type` to 'image' if not specified
- Existing images continue to work without migration

## Performance Considerations

### Video Optimization

1. **Recommended format:** MP4 (H.264 codec)
2. **Compression:** Use tools like HandBrake to compress videos
3. **Resolution:** Max 1920x1080 for web
4. **Bitrate:** 2-5 Mbps for good quality/size balance

### Loading Strategy

- Videos use `preload="metadata"` for faster page load
- Lazy loading not yet implemented (future enhancement)
- Consider CDN for high-traffic sites

## Future Enhancements

- [ ] Video thumbnails/posters
- [ ] Video transcoding
- [ ] Multiple video formats
- [ ] Streaming support
- [ ] Advanced video controls
- [ ] Video analytics

## Support

For issues or questions:
1. Check Supabase logs for errors
2. Review browser console
3. Verify database schema matches expected structure
4. Check storage bucket configuration
