# Image Fetching Diagnostic Guide

## What We've Fixed

✅ **Components Updated with Image Debugging:**
- `NewsCard.tsx` - Added console logging and image validation
- `ProjectCard.tsx` - Added console logging and image validation

✅ **Server-side Logging Enhanced:**
- `app/(public)/news/page.tsx` - Added image URL logging for first article
- `app/(public)/projects/page.tsx` - Added image URL logging for first project

✅ **Diagnostic API Created:**
- `app/api/debug/images/route.ts` - Shows image data from database

## How to Debug Images

### 1. Check Database Content
Visit: `http://your-app/api/debug/images`

This will show:
- How many articles/projects/works/team members exist
- Whether they have images (true/false)
- The actual image URLs stored

### 2. Check Browser Console
1. Open your site at `/news` or `/projects`
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Look for logs like:
   - `"Fetched news articles:"` - shows data fetched
   - `"First news article:"` - shows first item with image URL
   - `"NewsCard: Image found for..."` - shows image URL for each card
   - `"NewsCard: Missing image for..."` - shows articles without images
   - `"Failed to load image..."` - shows broken image URLs

### 3. Possible Issues & Solutions

**Issue: Images are null in database**
- Solution: Create new articles/projects with images using the admin panel
- Make sure to upload an image during creation
- Check that image upload completes successfully

**Issue: Image URLs look malformed**
- Solution: Check that the image URL starts with: `https://[project-id].supabase.co/storage/v1/object/public/atelier-media/`
- If URL is empty or wrong, images weren't properly uploaded

**Issue: Image loads but then disappears (404 error)**
- Solution: 
  1. Check Supabase Storage bucket permissions are public
  2. Verify the image file actually exists in Supabase Storage
  3. Check that the bucket name is `atelier-media` (case-sensitive)

**Issue: Image shows "No image" placeholder**
- Solution: This means the image field in database is null
- Re-create the item with an image attached

## Next.js Image Configuration

The following is already configured in `next.config.js`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
}
```

This allows Next.js Image component to load from Supabase Storage.

## Image Upload Flow

1. Admin uploads image in form
2. `ImageUpload.tsx` sends file to `/api/upload`
3. `/api/upload` calls `uploadImage()` from `lib/supabase/storage.ts`
4. Image saved to Supabase Storage bucket: `atelier-media`
5. Public URL returned and stored in database
6. When displaying, image URL is fetched from database and shown

## Environment Variables to Check

Ensure these are set in your Render deployment:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public key for client
- `SUPABASE_SERVICE_ROLE_KEY` - Secret key for server operations

## Files Modified for Debugging

1. `components/public/NewsCard.tsx` - Added useEffect with console.log
2. `components/public/ProjectCard.tsx` - Added useEffect with console.log
3. `app/(public)/news/page.tsx` - Added detailed image logging
4. `app/(public)/projects/page.tsx` - Added detailed image logging
5. `app/api/debug/images/route.ts` - New diagnostic endpoint

## To Fix Images:

1. Deploy these changes
2. Go to admin dashboard
3. Create a new article/project with an image
4. Check `/api/debug/images` to verify it's in database
5. Visit `/news` or `/projects` page
6. Open browser console (F12)
7. Check logs for image URLs
8. Verify images are showing on page

If images still don't show, share the output from `/api/debug/images` endpoint for further debugging.
