# Storage Buckets Implementation Summary

## ✅ What Was Created

### 1. SQL Setup Script
**File:** `scripts/supabase-storage-setup.sql`

Creates 8 separate storage buckets:
- `hero-slides` - Hero section images
- `projects` - Project images & galleries  
- `news` - News article images
- `works` - Creative works portfolio
- `team` - Team member photos
- `about` - About section images
- `slogan` - Slogan background images
- `collaborations` - User collaboration uploads

Each bucket has:
- 50MB file size limit
- MIME type restrictions (images only)
- Public read access for all visitors
- Authenticated admin write/delete access

### 2. Updated Storage Service
**File:** `lib/supabase/storage.ts`

Changed from single `atelier-media` bucket to bucket-per-section approach:
- Maps folder names to specific buckets
- Added logging for upload/delete operations
- Improved error handling with bucket names
- Updated URL extraction for delete operations

### 3. Documentation
**Files:**
- `STORAGE_SETUP.md` - Complete setup and troubleshooting guide
- `scripts/supabase-storage-setup.sql` - SQL setup queries

## 🚀 How to Implement

### Step 1: Create Buckets (Run Once)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **SQL Editor**
3. Create new query
4. Copy entire `scripts/supabase-storage-setup.sql`
5. Run it (Ctrl+Enter)

### Step 2: Verify in Dashboard
1. Go to **Storage**
2. Confirm all 8 buckets appear
3. Click each bucket → **Policies** tab
4. Verify policies are created

### Step 3: Test Uploads
Use admin panel to upload images for:
- Hero slides
- Projects
- News
- Works
- Team
- About
- Slogan

Check browser console (F12) for logs:
```
Uploading to bucket: projects, file: 1702553400123-abc7xyz.jpg
File uploaded successfully: 1702553400123-abc7xyz.jpg
Public URL: https://project.supabase.co/storage/v1/object/public/projects/1702553400123-abc7xyz.jpg
```

## 📊 Bucket Details

| Section | Folder Param | Bucket Name | Usage |
|---------|-------------|-------------|-------|
| Hero | `hero-slides` | `hero-slides` | Home page hero images |
| Projects | `projects` | `projects` | Project images + 4 gallery images |
| News | `news` | `news` | News article featured images |
| Works | `works` | `works` | Portfolio work images |
| Team | `team` | `team` | Team member profile photos |
| About | `about` | `about` | About section image |
| Slogan | `slogan` | `slogan` | Slogan section background |
| Users | `collaborations` | `collaborations` | Collaboration form uploads |

## 🔐 Security

### Public Access
- Anyone can VIEW/DOWNLOAD images
- URLs are public: `https://project.supabase.co/storage/v1/object/public/[bucket]/[filename]`

### Admin Access (Authenticated)
- Login required to UPLOAD images
- Login required to DELETE images
- Uses NextAuth session for authentication

### File Restrictions
- Only images allowed: JPEG, PNG, WebP, GIF
- Max 50MB per file
- Max size enforced by Supabase

## 🐛 Troubleshooting

### Images Not Loading?
1. Check bucket exists in Supabase Dashboard → Storage
2. Verify policies are created (should have `allow_public_read_*`)
3. Check image URL format in browser DevTools → Network
4. Check browser console for error messages

### Upload Failing?
1. Check authentication (must be logged in as admin)
2. Verify file is image format
3. Check file size (< 50MB)
4. Check browser console for error logs starting with "Upload error"

### Can't Find SQL Editor?
1. Go to Supabase Dashboard
2. Click your project
3. Left sidebar → **SQL Editor**
4. Click **New Query**
5. Paste SQL script

## 📝 File Naming

Images uploaded as:
```
[timestamp]-[random-id].[extension]
```

Examples:
- `1702553400123-abc7xyz.jpg`
- `1702553400456-xyz9abc.png`
- `1702553401789-def2lmn.webp`

Benefits:
- Unique filenames (no conflicts)
- Timestamp for sorting
- Random ID for unpredictability

## 🔄 Migration Notes

Old setup used single `atelier-media` bucket with folders:
```
atelier-media/
  ├── projects/
  ├── news/
  ├── works/
  ├── team/
  └── ...
```

New setup uses separate buckets:
```
projects/
news/
works/
team/
...
```

Old images still work (URLs don't change). New uploads use new buckets automatically.

## 📞 Support

For issues with:
- **Image uploads**: Check console logs, verify authentication
- **Image loading**: Check URL format, verify bucket policies
- **Supabase setup**: See STORAGE_SETUP.md for detailed guide
- **SQL errors**: Copy full error message, check syntax
