# Work Categories Management Feature

## Overview
Added complete admin functionality for managing **Work Categories** with cover images. Each category now has:
- Name & URL Slug
- Description
- Cover image (stored in Supabase Storage)
- Display order (drag to reorder)
- Active/inactive status

## Files Created/Updated

### 1. Database & Storage Files
- **`scripts/SQL_WORK_CATEGORIES_UPDATE.sql`** - Database migration to add cover image support
  - Adds `cover_image`, `order_position`, `is_active`, `updated_at` columns
  - Creates RLS policies for secure access
  - Includes sample data insertion

- **`scripts/WORK_CATEGORIES_STORAGE_SETUP.sql`** - Storage bucket configuration
  - Creates `work-categories` Supabase storage bucket
  - Sets up RLS policies for public read/authenticated write
  - Includes API usage examples

### 2. API Route
- **`app/api/work-categories/route.ts`** - REST API endpoints
  - `GET /api/work-categories` - Get all categories (supports `?includeInactive=true`)
  - `GET /api/work-categories?id={id}` - Get single category
  - `POST /api/work-categories` - Create new category
  - `PATCH /api/work-categories` - Update existing category
  - `DELETE /api/work-categories?id={id}` - Delete category (cleans up storage)

### 3. Admin Pages
- **`app/admin/work-categories/page.tsx`** - Category list page
  - Grid view with cover images
  - Edit, delete, reorder buttons
  - Active/inactive status badge
  - Drag-to-reorder functionality (up/down buttons)

- **`app/admin/work-categories/new/page.tsx`** - Create category form
  - Name field (auto-generates slug)
  - Description textarea
  - Cover image upload with preview
  - Display order input
  - Form validation

- **`app/admin/work-categories/[id]/edit/page.tsx`** - Edit category form
  - All fields from create page
  - Image replacement with cleanup
  - Active/inactive toggle
  - Pre-populated form data

### 4. Type Definitions
- **`types/database.ts`** - Updated work_categories type to include:
  - `cover_image: string | null`
  - `order_position: number`
  - `is_active: boolean`
  - `updated_at: string`

## Features

### Admin Capabilities
✅ Create new work categories with cover images  
✅ Edit category details and replace cover images  
✅ Delete categories (automatically removes cover images)  
✅ Reorder categories using up/down buttons  
✅ Toggle active/inactive status  
✅ View all categories in grid layout with previews  

### Image Management
✅ Drag-and-drop file upload  
✅ Image preview before upload  
✅ Automatic filename generation with timestamp  
✅ Public URL generation for displaying images  
✅ Old image cleanup on replacement  
✅ Support for PNG, JPG, GIF, WebP  

### Data Organization
✅ URL-friendly slugs (auto-generated from name)  
✅ Display ordering system  
✅ Active/inactive filtering  
✅ Description field for category details  
✅ Timestamps for audit trail  

## Setup Instructions

### 1. Apply Database Migration
```sql
-- Copy and run SQL_WORK_CATEGORIES_UPDATE.sql in Supabase SQL Editor
-- This adds columns: cover_image, order_position, is_active, updated_at
```

### 2. Create Storage Bucket
```sql
-- Copy and run WORK_CATEGORIES_STORAGE_SETUP.sql
-- Or manually create bucket "work-categories" in Supabase dashboard
-- Set as public bucket
```

### 3. Enable RLS Policies
- All policies are created in the SQL setup scripts
- Allows public read access to category images
- Restricts write access to authenticated admins

## API Usage Examples

### Get All Active Categories
```javascript
const response = await fetch('/api/work-categories')
const categories = await response.json()
```

### Create Category
```javascript
const response = await fetch('/api/work-categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Residential Design',
    slug: 'residential-design',
    description: 'Modern residential projects',
    cover_image: 'https://...',
    order_position: 0
  })
})
```

### Update Category
```javascript
const response = await fetch('/api/work-categories', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'category-id',
    name: 'Updated Name',
    is_active: true,
    order_position: 1
  })
})
```

### Delete Category
```javascript
const response = await fetch('/api/work-categories?id=category-id', {
  method: 'DELETE'
})
```

## Integration Points

### Navigation
The category management link should be added to:
- Admin sidebar: `/admin/work-categories`
- Admin dashboard quick links

### Usage in Works
Work items can be filtered/associated by category using the `category_id` field in the works table

### Public Display
Use categories for:
- Filter buttons on works listing page
- Portfolio sections/galleries
- Navigation filters

## Database Schema

```sql
Table: work_categories
- id (UUID, primary key)
- name (VARCHAR, required)
- slug (VARCHAR, required, unique)
- description (TEXT, optional)
- cover_image (TEXT, optional) -- URL to storage
- order_position (INTEGER, default: 0)
- is_active (BOOLEAN, default: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Storage Structure

```
Bucket: work-categories
├── {timestamp}-{filename}.jpg
├── {timestamp}-{filename}.png
└── ...
```

Public URL format:
```
https://{project-id}.supabase.co/storage/v1/object/public/work-categories/{filename}
```

## Performance Notes

- Indexes created on: `slug`, `is_active`, `order_position`
- Categories are sorted by `order_position` for consistent ordering
- Cover images are optimized at storage level
- API responses filtered by `is_active` by default

## Future Enhancements

- Bulk reordering drag-and-drop interface
- Category templates
- Default images if no cover specified
- Category analytics (works count)
- Nested categories/subcategories
- Color coding by category
