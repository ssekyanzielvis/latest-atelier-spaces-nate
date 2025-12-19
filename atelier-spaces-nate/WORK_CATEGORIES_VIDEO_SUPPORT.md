# Work Categories Video Support

This document describes the implementation of video support for work categories.

## Overview

Work categories now support both image and video files for cover media, similar to the gallery feature. This allows administrators to upload MP4 videos as category covers, which will display with autoplay and looping on the public website.

## Database Changes

### Required Migration

Run the following SQL script to update your database:

```sql
-- File: scripts/update-work-categories-for-video.sql

-- Add media_type column to work_categories table
ALTER TABLE work_categories 
ADD COLUMN IF NOT EXISTS media_type VARCHAR(10) DEFAULT 'image' CHECK (media_type IN ('image', 'video'));

-- Rename cover_image to cover_media (with conditional check)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'work_categories' AND column_name = 'cover_image'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'work_categories' AND column_name = 'cover_media'
  ) THEN
    ALTER TABLE work_categories RENAME COLUMN cover_image TO cover_media;
  END IF;
END $$;

-- Update existing records to have media_type = 'image'
UPDATE work_categories SET media_type = 'image' WHERE media_type IS NULL;

-- Add cover_image as an alias for backward compatibility
ALTER TABLE work_categories 
ADD COLUMN IF NOT EXISTS cover_image VARCHAR(500);

-- Sync cover_image with cover_media for existing records
UPDATE work_categories SET cover_image = cover_media WHERE cover_image IS NULL;
```

### Schema Changes

- **media_type**: New column to indicate whether the cover is an 'image' or 'video'
- **cover_media**: Renamed from `cover_image` to better represent both images and videos
- **cover_image**: Maintained as an alias for backward compatibility

## Updated Components

### 1. Admin - New Work Category Page
**File**: `app/admin/work-categories/new/page.tsx`

- Uses `MediaUpload` component with `acceptVideo={true}`
- Tracks `media_type` in component state
- Submits both `cover_media` and `cover_image` (for compatibility) to API

### 2. Admin - Edit Work Category Page
**File**: `app/admin/work-categories/[id]/edit/page.tsx`

- Replaced file upload UI with `MediaUpload` component
- Supports video uploads up to 50MB
- Handles existing cover media (image or video)
- Deletes old media when replacing with new media

### 3. Work Categories API
**File**: `app/api/work-categories/route.ts`

**POST Method**:
- Accepts `cover_media`, `cover_image`, and `media_type` fields
- Validates media_type is either 'image' or 'video'
- Inserts both `cover_media` and `cover_image` for backward compatibility
- Defaults to 'image' if no media_type specified

**PATCH Method**:
- Accepts `cover_media`, `cover_image`, and `media_type` fields
- Updates both fields when either is provided
- Validates media_type if provided

**DELETE Method**:
- Checks both `cover_media` and `cover_image` fields
- Deletes media file from storage bucket

### 4. Public Display - Homepage
**File**: `app/(public)/page.tsx`

- Work categories section now conditionally renders video or image
- Videos display with:
  - `autoPlay`
  - `loop`
  - `muted`
  - `playsInline`
- Falls back to image display for image media types
- Maintains hover effects and overlay gradient

## File Upload Support

### Supported Formats
- **Images**: JPG, JPEG, PNG, WebP, GIF (up to 5MB)
- **Videos**: MP4, WebM (up to 50MB)

### Storage Bucket
- Bucket name: `work-categories`
- Publicly accessible with appropriate CORS and RLS policies

## Usage Instructions

### Creating a New Work Category with Video

1. Navigate to Admin > Work Categories > Add New
2. Fill in category name and description
3. Click "Upload Image or Video" button
4. Select an MP4 or WebM video file (up to 50MB)
5. The preview will show the video with a "Video" badge
6. Submit the form

### Editing Existing Work Category

1. Navigate to Admin > Work Categories
2. Click Edit on any category
3. The current cover media (image or video) will be displayed
4. To change the media, click "Upload Image or Video"
5. Select a new file (image or video)
6. The old media will be automatically deleted when you save

### Public Display

Work categories with video covers will:
- Display on the homepage in the "Other Works" section
- Autoplay and loop continuously
- Mute audio by default
- Scale on hover like image covers
- Show title, description, and "Explore" button overlay

## Backward Compatibility

The implementation maintains full backward compatibility:

1. **API**: Accepts both `cover_image` and `cover_media` field names
2. **Database**: Stores data in both columns
3. **Frontend**: Checks both fields when displaying media
4. **Default**: Treats missing `media_type` as 'image'

This ensures existing work categories with images continue to work without any changes.

## Testing Checklist

- [ ] Create new work category with image
- [ ] Create new work category with video (MP4)
- [ ] Edit existing category and replace image with video
- [ ] Edit existing category and replace video with image
- [ ] Verify old media is deleted when replaced
- [ ] Check public homepage displays videos correctly
- [ ] Test video autoplay and looping
- [ ] Verify hover effects work on video covers
- [ ] Confirm backward compatibility with existing categories
- [ ] Test file size validation (reject files over 50MB for videos)
- [ ] Test file type validation (reject unsupported formats)

## Related Features

This implementation follows the same pattern as:
- Gallery video support (see `GALLERY_VIDEO_SUPPORT.md`)
- Uses the shared `MediaUpload` component

## Future Enhancements

Potential improvements:
1. Video thumbnail generation for faster loading
2. Support for additional video formats (AVI, MOV)
3. Video compression/optimization on upload
4. Custom video controls on hover
5. Video preview on admin list page
