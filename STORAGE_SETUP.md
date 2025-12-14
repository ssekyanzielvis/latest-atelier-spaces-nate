# Storage Buckets Setup Guide

## Overview
This project uses separate Supabase Storage buckets for each content section to improve organization, security, and performance.

## Storage Buckets

| Bucket Name | Purpose | Folder Parameter | Max Size |
|------------|---------|------------------|----------|
| `hero-slides` | Hero section images | `hero-slides` | 50MB |
| `projects` | Project images & gallery | `projects` | 50MB |
| `news` | News article images | `news` | 50MB |
| `works` | Creative works portfolio | `works` | 50MB |
| `team` | Team member photos | `team` | 50MB |
| `about` | About section images | `about` | 50MB |
| `slogan` | Slogan section backgrounds | `slogan` | 50MB |
| `collaborations` | User collaboration uploads | `collaborations` | 50MB |

## Setup Instructions

### Step 1: Run SQL Setup Script

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Click **"New Query"**
5. Copy the entire content from `scripts/supabase-storage-setup.sql`
6. Paste it into the SQL editor
7. Click **"Run"** (or press Ctrl+Enter)

This will:
- Create all 8 storage buckets
- Set them as public for read access
- Apply RLS policies for authenticated uploads

### Step 2: Verify Buckets in Dashboard

1. Go to **Storage** in your Supabase dashboard
2. You should see all 8 buckets listed
3. Click each bucket to verify:
   - **Policies** tab shows public read + admin write policies
   - **Settings** shows file size limit (50MB) and MIME type restrictions

### Step 3: Test Image Uploads

Use the admin panel to create:
- A new **Hero Slide** with an image
- A new **Project** with main image + gallery images
- A new **News Article** with an image
- A new **Work** with an image
- A new **Team Member** with a photo
- An **About Section** with an image
- A **Slogan Section** with background image

Check the browser console for upload logs:
```
Uploading to bucket: projects, file: 1234567890-abc123.jpg
File uploaded successfully: 1234567890-abc123.jpg
Public URL: https://your-project.supabase.co/storage/v1/object/public/projects/1234567890-abc123.jpg
```

## Image Upload Flow

### Current Implementation

```typescript
// Uploading to specific bucket
const imageUrl = await uploadImage(file, 'projects')
// Maps 'projects' → 'projects' bucket
// Returns: https://project.supabase.co/storage/v1/object/public/projects/filename.jpg
```

### Folder to Bucket Mapping

The `lib/supabase/storage.ts` file contains:
```typescript
const FOLDER_TO_BUCKET = {
  'hero-slides': 'hero-slides',
  'projects': 'projects',
  'news': 'news',
  'works': 'works',
  'team': 'team',
  'about': 'about',
  'slogan': 'slogan',
  'collaborations': 'collaborations',
}
```

## Troubleshooting

### Images still not loading?

1. **Check Bucket Policies**
   - Go to Storage → Select bucket → Policies
   - Verify `allow_public_read_*` policy exists
   - It should allow `FOR SELECT` without conditions

2. **Check Image URL Format**
   - Should be: `https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[filename]`
   - Check browser DevTools → Network to see actual URL

3. **Check Upload Logs**
   - Open browser Console (F12)
   - Look for `Uploading to bucket:` log
   - Check for upload errors
   - Verify file was actually uploaded to correct bucket

4. **Check File Exists**
   - Go to Supabase Dashboard → Storage
   - Click the bucket
   - You should see the uploaded files

5. **Check MIME Type**
   - Only JPEG, PNG, WebP, GIF are allowed
   - Try uploading a PNG if JPG fails

### Upload Failing?

- Check file size (max 50MB per file)
- Verify authentication is working (NextAuth)
- Check browser console for detailed error messages
- Verify you're using the correct folder parameter

## Database Links

All image URLs are stored in database tables:
- `hero_slides.image`
- `projects.image`, `projects.gallery_image_1-4`
- `news_articles.image`
- `works.image`
- `team_members.image`
- `about_section.image`
- `slogan_section.background_image`

## File Organization

Images are automatically named with timestamp and random ID:
```
[timestamp]-[random].ext
Example: 1702553400123-abc7xyz.jpg
```

This prevents filename conflicts and ensures unique file names.

## Security Notes

1. **Public Read**: Anyone can view/download images
2. **Authenticated Write**: Only logged-in admins can upload/delete
3. **MIME Type Restricted**: Only image files allowed
4. **File Size Limited**: 50MB max per file
5. **No Directory Traversal**: Files stored flat in bucket (no nested folders)

## Performance Tips

1. **Image Optimization**
   - Use WebP format when possible (smaller file sizes)
   - Resize images before upload (avoid uploading 10MB+ files)
   - Recommended max: 5MB per image

2. **Caching**
   - All files cached for 1 hour (3600 seconds)
   - Browser caching may require hard refresh to see new uploads

3. **CDN**
   - Supabase Storage uses Cloudflare CDN for global distribution
   - Images are automatically cached at edge locations

## Monitoring

To check storage usage:
1. Go to Supabase Dashboard
2. Click **Storage** 
3. See total used storage at bottom

## Migration from Old Setup

If you previously used the `atelier-media` bucket:

1. Keep old bucket for reference
2. New uploads use new buckets
3. Old images still work (URLs don't change)
4. Optionally migrate old images:
   ```bash
   # Move files from atelier-media/[folder]/* to [bucket]/*
   ```

## References

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage RLS Policies](https://supabase.com/docs/guides/storage/security)
- [Bucket Configuration](https://supabase.com/docs/guides/storage/buckets)
