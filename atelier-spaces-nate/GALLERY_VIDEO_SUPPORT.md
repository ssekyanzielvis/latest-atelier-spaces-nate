# Gallery Video Support - Setup Guide

## Overview
The gallery now supports both **images** and **videos (MP4)** uploads. This guide explains what was implemented and how to enable it.

## Changes Made

### 1. Database Updates
**File:** `scripts/update-gallery-for-video.sql`

The gallery table structure was updated to support videos:
- Added `media_type` column (values: 'image' or 'video')
- Renamed `image_url` to `media_url` for clarity
- Added index on `media_type` for better performance
- Backward compatible with old `image_url` column name

**To Apply:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL script: `scripts/update-gallery-for-video.sql`
3. This will update your existing gallery table structure

### 2. New MediaUpload Component
**File:** `components/admin/MediaUpload.tsx`

Created a new component that supports both images and videos:
- Accepts images: JPG, PNG, WebP, GIF
- Accepts videos: MP4, WebM
- File size limits:
  - Images: 5MB max
  - Videos: 50MB max
- Shows preview for both image and video files
- Displays media type badge (IMAGE/VIDEO)
- Auto-detects file type on upload

### 3. Updated Admin Pages

**Gallery New Page** (`app/admin/gallery/new/page.tsx`):
- Uses new MediaUpload component
- Tracks media type (image/video)
- Submits media_url and media_type to API

### 4. Updated API Routes

**Gallery API** (`app/api/gallery/route.ts`):
- Supports both `media_url` and legacy `image_url` field names
- Validates and stores `media_type` field
- Backward compatible with existing data

**Upload API** (`app/api/upload/route.ts`):
- Now accepts video files (MP4, WebM)
- Validates file size based on type (5MB for images, 50MB for videos)

### 5. Updated Public Display

**Gallery Page** (`app/(public)/gallery/page.tsx`):
- Displays videos with HTML5 `<video>` player
- Shows images with Next.js Image component
- Both support the 2-column grid layout
- Backward compatible: supports both `media_url` and `image_url`

**Homepage Gallery Preview** (`app/(public)/page.tsx`):
- Displays video previews (muted, no controls on homepage)
- Shows images with hover effects
- Handles both media types seamlessly

## How to Use

### Adding Videos to Gallery

1. **Login to Admin Dashboard**
2. Go to **Gallery** → **Add New Gallery Item**
3. Click **"Select Image or Video"**
4. Choose an MP4 or WebM video file (max 50MB)
5. Fill in title, description, and category
6. Click **"Add to Gallery"**

### Storage Configuration

Make sure your Supabase storage bucket allows video files:

1. Go to Supabase Dashboard → **Storage** → **gallery** bucket
2. Update **Allowed MIME types** to include:
   ```
   image/jpeg
   image/png
   image/webp
   image/gif
   video/mp4
   video/webm
   ```
3. Set **Max file size** to at least 50MB (52428800 bytes)

### Video Format Recommendations

For best browser compatibility:
- **Format:** MP4 with H.264 codec
- **Resolution:** 1920x1080 (Full HD) or lower
- **File size:** Under 50MB for reasonable loading times
- **Duration:** Keep videos under 2 minutes for gallery display

## Backward Compatibility

✅ **Existing gallery images continue to work**
- Old records with `image_url` are automatically handled
- System supports both `image_url` and `media_url`
- Defaults to `media_type: 'image'` for old records

## Features

### Admin Features
- ✅ Upload images (JPG, PNG, WebP, GIF)
- ✅ Upload videos (MP4, WebM)
- ✅ Preview before upload
- ✅ Media type badge display
- ✅ File size validation
- ✅ Drag-and-drop support

### Public Display Features
- ✅ Video player with controls on gallery page
- ✅ Muted video preview on homepage
- ✅ Responsive layout (2-column grid)
- ✅ Smooth transitions and hover effects
- ✅ Proper aspect ratios maintained

## Troubleshooting

### Videos not uploading?
1. Check Supabase storage bucket allows video MIME types
2. Verify file size is under 50MB
3. Ensure video format is MP4 or WebM

### Videos not displaying?
1. Check that `media_type` field is set to 'video'
2. Verify `media_url` contains valid video URL
3. Test video URL directly in browser

### Need to update existing records?
Run this SQL to set media_type for existing items:
```sql
UPDATE gallery 
SET media_type = 'image' 
WHERE media_type IS NULL;
```

## Next Steps

1. ✅ Run the database migration script
2. ✅ Update storage bucket settings
3. ✅ Test uploading a video through admin panel
4. ✅ Verify video displays correctly on gallery page
5. ✅ Check video preview on homepage

## File Changes Summary

**Created:**
- `scripts/update-gallery-for-video.sql` - Database migration
- `components/admin/MediaUpload.tsx` - New media upload component

**Updated:**
- `app/admin/gallery/new/page.tsx` - Support video uploads
- `app/api/gallery/route.ts` - Handle media_url and media_type
- `app/api/upload/route.ts` - Accept video files
- `app/(public)/gallery/page.tsx` - Display videos
- `app/(public)/page.tsx` - Show video previews

All changes are backward compatible with existing image-only gallery items!
