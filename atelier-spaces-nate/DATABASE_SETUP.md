# DATABASE SETUP GUIDE

## How to Set Up Your Supabase Database

### Step 1: Run the SQL Schema

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project: `loetbmdkawhlkamtqjij`
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire contents of `scripts/complete-database-schema.sql`
6. Click **Run** (or press Ctrl/Cmd + Enter)

This will create:
- ✅ All 11 tables
- ✅ Indexes for performance
- ✅ Security policies (RLS)
- ✅ Default work categories (Omweso, Kinsman, Design, Architecture, Royal Toast Games, Nate Art Projects)
- ✅ Auto-update triggers

### Step 2: Create Your Admin User

Run this command in your terminal:

```bash
node scripts/create-admin.js
```

This creates the admin account with:
- **Username:** admin
- **Password:** admin123
- **Email:** admin@atelier.com

### Step 3: Set Up Supabase Storage for Images

1. Go to **Storage** in Supabase sidebar
2. Click **New Bucket**
3. Create these buckets:
   - `hero-slides` (for dynamic homepage images)
   - `works` (for work images and galleries)
   - `team` (for team member photos)
   - `projects` (for project images)
   - `news` (for news article images)
   - `about` (for about section images)

4. For each bucket, set **Public** access:
   - Click on the bucket
   - Go to **Policies**
   - Add policy: "Public read access"
   - Enable: `SELECT` for everyone

## Data Flow Architecture

```
┌─────────────────────┐
│  Admin Dashboard    │
│  /admin/*           │
│                     │
│  - Login with       │
│    username: admin  │
│    password:admin123│
│                     │
│  - Add/Edit content │
│  - Upload images    │
└──────────┬──────────┘
           │
           │ Saves to
           ▼
┌─────────────────────┐
│   SUPABASE          │
│                     │
│  Tables:            │
│  - hero_slides      │
│  - works            │
│  - work_categories  │
│  - about_section    │
│  - slogan_section   │
│  - team_members     │
│  - projects         │
│  - news_articles    │
│  - collaborations   │
│                     │
│  Storage:           │
│  - Images/files     │
└──────────┬──────────┘
           │
           │ Fetches from
           ▼
┌─────────────────────┐
│  Public Website     │
│  /                  │
│                     │
│  Homepage Sections: │
│  1. Hero Slides     │
│  2. Featured Works  │
│  3. Slogan          │
│  4. Work Categories │
│  5. About Us        │
│  6. Our Team        │
└─────────────────────┘
```

## What Each Table Controls on Website

### hero_slides → Homepage Hero Carousel
- Dynamic images that auto-rotate
- Each slide has title, subtitle, and optional CTA button
- Admin sets order_position to control sequence
- Only active slides (is_active=true) are displayed

### works → Featured Works Section & Work Detail Pages
- Featured works (featured=true) appear on homepage
- 2-column layout on desktop, 1-column on mobile
- Click work → shows detail page with gallery
- Related works shown based on category

### work_categories → Other Works Section
- Categories: Omweso, Kinsman, Design, Architecture, etc.
- Each category is clickable
- Shows all works in that category

### slogan_section → Slogan Section
- Large enhanced text with high contrast
- Optional background image
- Only one slogan (single row table)

### about_section → About Us Section
- Main content, mission, vision, values
- Optional image
- Only one about section (single row table)

### team_members → Our Team Section
- Shows top 4 members on homepage
- Each member has photo, name, position, bio
- Link to "View All Team Members" page
- Admin sets order_position for display order

### projects → Projects Page
- Architecture and design projects
- Similar to works but separate section
- Featured projects can be highlighted

### news_articles → News Page
- Blog posts and updates
- Can be featured on homepage

### collaborations → Collaboration Requests
- Stores form submissions from /collaborate page
- Admin can view and manage in dashboard
- Status: pending, reviewed, accepted, rejected

## Admin Dashboard Pages

All admin pages are at `/admin/*`:

| Page | URL | What It Controls |
|------|-----|------------------|
| Dashboard | `/admin/dashboard` | Overview & stats |
| Hero Slides | `/admin/hero-slides` | Dynamic homepage images |
| Works | `/admin/works` | Featured works & portfolio |
| Work Categories | `/admin/work-categories` | Omweso, Kinsman, etc. |
| Projects | `/admin/projects` | Architecture projects |
| News | `/admin/news` | News articles |
| Team | `/admin/team` | Team members |
| Categories | `/admin/categories` | Project categories |
| About | `/admin/about` | About Us content |
| Slogan | `/admin/slogan` | Homepage slogan |
| Collaborations | `/admin/collaborations` | View requests |

## Image Upload Instructions

When admin uploads images:

1. **From Admin Dashboard:**
   - Use the ImageUpload component
   - Select image file
   - Automatic upload to Supabase Storage
   - Returns public URL
   - URL saved to database

2. **Supported Formats:**
   - JPG, PNG, WebP
   - Max size: 5MB recommended
   - Automatic optimization

3. **Image URLs:**
   - Stored in Supabase Storage
   - Public URLs like: `https://loetbmdkawhlkamtqjij.supabase.co/storage/v1/object/public/works/image.jpg`
   - These URLs are saved in database columns (image, gallery_image_1, etc.)

## Testing the Setup

After running the SQL schema:

1. **Login to Admin:**
   ```
   URL: http://localhost:3000/admin/login
   Username: admin
   Password: admin123
   ```

2. **Add Test Content:**
   - Go to `/admin/hero-slides` → Add a slide
   - Go to `/admin/work-categories` → Categories are pre-loaded
   - Go to `/admin/works` → Add a featured work
   - Go to `/admin/slogan` → Add slogan text
   - Go to `/admin/about` → Add about content
   - Go to `/admin/team` → Add team members

3. **View on Website:**
   - Go to homepage: `/`
   - See all your content displayed automatically!

## Troubleshooting

**Q: Tables not created?**
- Make sure you ran the entire SQL file
- Check SQL Editor for error messages
- Verify you're in the correct Supabase project

**Q: Can't login to admin?**
- Run `node scripts/create-admin.js` to create admin user
- Check console for success message
- Verify environment variables in `.env.local`

**Q: Images not uploading?**
- Create storage buckets as described in Step 3
- Set buckets to public access
- Check file size (keep under 5MB)

**Q: Content not showing on website?**
- Check if is_active = true (for hero_slides, team_members)
- Check if featured = true (for featured works)
- Open browser console for error messages
- Verify data exists in Supabase Table Editor

## Need Help?

Check these resources:
- Supabase Dashboard: https://supabase.com/dashboard/project/loetbmdkawhlkamtqjij
- Table Editor: View/edit data directly
- SQL Editor: Run custom queries
- Storage: Manage uploaded files
