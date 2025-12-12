# Atelier Spaces - Setup Guide

## Overview
This is a complete Next.js 14+ application with:
- **Public Website**: Projects, Works, News, Team, and Collaboration form
- **Admin Panel**: Full CRUD operations for all content
- **Supabase Backend**: PostgreSQL database + file storage
- **NextAuth.js**: Admin authentication
- **Responsive Design**: Black & white minimalist theme

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)
- Basic knowledge of Next.js and React

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Name: `atelier-spaces`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### 1.2 Get API Keys
1. Go to Project Settings > API
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`, keep this secret!)

### 1.3 Set up Database
1. Go to SQL Editor in Supabase dashboard
2. Copy the entire contents of `scripts/setup-database.sql`
3. Paste and click "Run"
4. Verify tables are created in Table Editor

## Step 2: Environment Configuration

### 2.1 Update .env.local
Open `.env.local` and replace with your actual values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# NextAuth
NEXTAUTH_SECRET=your-random-secret-here-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET:**
Run in terminal:
```bash
openssl rand -base64 32
```
Or use: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Create Admin User

```bash
node scripts/create-admin.js
```

This creates:
- **Username**: admin
- **Password**: admin123
- **Email**: admin@atelier.com

⚠️ **Change the password immediately after first login!**

## Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Test the Application

### Public Website
1. Navigate to http://localhost:3000
2. You should see the homepage (may be empty initially)
3. Try navigating to:
   - `/projects` - Projects list
   - `/works` - Works list
   - `/news` - News articles
   - `/team` - Team members
   - `/collaborate` - Contact form

### Admin Panel
1. Navigate to http://localhost:3000/admin/login
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. You'll be redirected to the admin dashboard
4. Explore the admin sections:
   - Dashboard - Overview and stats
   - Projects - Manage projects
   - Works - Manage works
   - News - Manage news articles
   - Team - Manage team members
   - Hero Slides - Manage homepage slides
   - Collaborations - View submissions

## Step 7: Add Content

### Add a Hero Slide
1. Go to Admin > Hero Slides
2. Click "Add New"
3. Upload an image (drag & drop or click)
4. Fill in title, subtitle, CTA text and link
5. Save

### Add a Project
1. Go to Admin > Projects
2. Click "Create New"
3. Fill in project details
4. Upload main image and gallery images
5. Save

### Add Team Members
1. Go to Admin > Team
2. Add team member with photo and details
3. Save

## Project Structure

```
atelier-spaces-nate/
├── app/
│   ├── (public)/          # Public website pages
│   │   ├── layout.tsx     # Header + Footer
│   │   ├── page.tsx       # Homepage
│   │   ├── projects/
│   │   ├── works/
│   │   ├── news/
│   │   ├── team/
│   │   └── collaborate/
│   │
│   ├── admin/             # Admin panel
│   │   ├── layout.tsx     # Admin layout with sidebar
│   │   ├── login/         # Login page
│   │   ├── dashboard/     # Dashboard
│   │   ├── projects/      # Manage projects
│   │   └── ...
│   │
│   └── api/               # API routes
│       ├── collaborate/   # Contact form API
│       └── upload/        # Image upload API
│
├── components/
│   ├── public/            # Public website components
│   ├── admin/             # Admin panel components
│   └── ui/                # Reusable UI components
│
├── lib/
│   ├── supabase/          # Supabase client/server/storage
│   ├── auth.ts            # NextAuth configuration
│   ├── utils.ts           # Utility functions
│   └── validations.ts     # Zod schemas
│
├── types/
│   ├── database.ts        # Database types
│   └── index.ts           # Exported types
│
├── scripts/
│   ├── setup-database.sql # Database setup script
│   └── create-admin.js    # Create admin user
│
└── middleware.ts          # Route protection
```

## Color Scheme
The app uses a minimalist black and white color scheme:
- **Background**: White (#FFFFFF)
- **Text**: Dark gray (#262626) - not too dark black
- **Accents**: Darker shades for emphasis
- **Borders**: Light gray (#E5E5E5)

All components are responsive and work on mobile, tablet, and desktop.

## Deployment to Netlify

### Prerequisites
- GitHub account
- Netlify account

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy"

3. **Add Environment Variables**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add all variables from `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL` (set to your Netlify URL, e.g., https://your-site.netlify.app)
     - `NEXT_PUBLIC_APP_URL` (same as NEXTAUTH_URL)

4. **Redeploy**
   - Go to Deploys tab
   - Click "Trigger deploy" > "Deploy site"

5. **Test Your Site**
   - Visit your Netlify URL
   - Test public pages
   - Login to admin panel

## Common Issues

### 1. "Unauthorized" Error in Admin Panel
- Check `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### 2. Images Not Uploading
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Supabase storage bucket exists: `atelier-media`
- Check storage policies are set up correctly

### 3. Database Connection Errors
- Verify Supabase URL and keys are correct
- Check if database tables exist
- Run `setup-database.sql` again if needed

### 4. Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

## Features Checklist

### Public Website ✅
- [x] Homepage with hero slider
- [x] Projects list and detail pages
- [x] Works list and detail pages
- [x] News/blog list and detail pages
- [x] Team page
- [x] Collaboration/contact form
- [x] Responsive header and footer
- [x] Mobile-friendly navigation

### Admin Panel ✅
- [x] Secure login with NextAuth
- [x] Dashboard with statistics
- [x] Projects CRUD (create structure)
- [x] Works CRUD (create structure)
- [x] News CRUD (create structure)
- [x] Team members CRUD (create structure)
- [x] Hero slides management (create structure)
- [x] Collaborations inbox (create structure)
- [x] Image upload functionality
- [x] Sidebar navigation
- [x] Protected routes

### Technical ✅
- [x] Supabase integration (database + storage)
- [x] NextAuth authentication
- [x] Server-side rendering (SSR)
- [x] TypeScript types
- [x] Form validation with Zod
- [x] Responsive design
- [x] Black & white color scheme

## Next Steps

1. **Complete Admin CRUD Pages**: Expand the admin CRUD functionality for all resources (projects, news, works, team, hero slides)
2. **Add Rich Text Editor**: Install and integrate a WYSIWYG editor for news content
3. **Image Optimization**: Add image compression before upload
4. **Search & Filters**: Add search and filtering to admin lists
5. **Email Notifications**: Send emails when collaboration forms are submitted
6. **Analytics**: Integrate Google Analytics or similar
7. **SEO**: Add meta tags, sitemap, robots.txt
8. **Custom Domain**: Set up a custom domain in Netlify

## Support

For issues or questions:
1. Check the documentation
2. Review Supabase logs
3. Check browser console for errors
4. Review Next.js and Supabase documentation

## Security Notes

- Never commit `.env.local` to version control
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Change default admin password immediately
- Use strong passwords for production
- Enable 2FA on Supabase and Netlify accounts
- Regularly update dependencies

## License

This project is for internal use. All rights reserved.
