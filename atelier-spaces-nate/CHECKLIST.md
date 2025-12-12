# ✅ SETUP CHECKLIST - Follow This Step by Step

Print this out or check off as you go!

---

## PHASE 1: DEPENDENCIES (5 minutes)

- [ ] Open terminal in project folder
- [ ] Run: `npm install`
- [ ] Wait for installation to complete
- [ ] Verify no error messages

---

## PHASE 2: SUPABASE SETUP (10 minutes)

### Step 1: Create Project
- [ ] Go to https://supabase.com
- [ ] Click "Sign In" (or "Sign Up" if new)
- [ ] Click "New Project"
- [ ] Enter details:
  - [ ] Name: `atelier-spaces`
  - [ ] Database Password: (save this!)
  - [ ] Region: Choose closest to you
- [ ] Click "Create new project"
- [ ] Wait ~2 minutes for project creation

### Step 2: Get API Keys
- [ ] Click "Settings" (gear icon) in left sidebar
- [ ] Click "API" section
- [ ] Copy these THREE values (you'll need them):
  - [ ] Project URL (starts with https://)
  - [ ] anon public key (starts with eyJ...)
  - [ ] service_role key (starts with eyJ..., marked as SECRET)

### Step 3: Set Up Database
- [ ] Click "SQL Editor" in left sidebar
- [ ] Click "New query"
- [ ] Open file: `scripts/setup-database.sql`
- [ ] Copy ALL contents
- [ ] Paste into SQL Editor
- [ ] Click "Run" button
- [ ] Verify success message (no errors in red)
- [ ] Click "Table Editor" to see your tables

### Step 4: Verify Tables Created
In Table Editor, you should see:
- [ ] admins
- [ ] projects
- [ ] news_articles
- [ ] works
- [ ] team_members
- [ ] hero_slides
- [ ] collaborations
- [ ] categories
- [ ] work_categories
- [ ] about_section
- [ ] slogan_section

### Step 5: Check Storage Bucket
- [ ] Click "Storage" in left sidebar
- [ ] Verify bucket named "atelier-media" exists
- [ ] If not, click "New bucket" and create it (public)

---

## PHASE 3: ENVIRONMENT SETUP (5 minutes)

### Step 1: Open .env.local
- [ ] Open file: `.env.local`

### Step 2: Update Supabase Values
Replace with YOUR values from Supabase:
- [ ] `NEXT_PUBLIC_SUPABASE_URL=` (your Project URL)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY=` (your anon key)
- [ ] `SUPABASE_SERVICE_ROLE_KEY=` (your service_role key)

### Step 3: Generate NEXTAUTH_SECRET
Choose ONE method:

**Method A (Mac/Linux):**
- [ ] Run in terminal: `openssl rand -base64 32`
- [ ] Copy the output
- [ ] Paste into `NEXTAUTH_SECRET=`

**Method B (Windows PowerShell):**
- [ ] Run: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- [ ] Copy the output
- [ ] Paste into `NEXTAUTH_SECRET=`

### Step 4: Verify .env.local
Check that ALL these are filled in (no "your-xxx-here"):
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] NEXTAUTH_SECRET (long random string)
- [ ] NEXTAUTH_URL (http://localhost:3000)
- [ ] NEXT_PUBLIC_APP_URL (http://localhost:3000)

---

## PHASE 4: CREATE ADMIN USER (2 minutes)

- [ ] Run in terminal: `npm run create-admin`
- [ ] Verify success message
- [ ] Note the credentials:
  - Username: admin
  - Password: admin123
  - Email: admin@atelier.com

---

## PHASE 5: FIRST RUN (2 minutes)

### Step 1: Start Dev Server
- [ ] Run in terminal: `npm run dev`
- [ ] Wait for "Ready" message
- [ ] Note the URL (usually http://localhost:3000)

### Step 2: Test Public Site
- [ ] Open browser
- [ ] Go to http://localhost:3000
- [ ] Verify homepage loads (may be empty, that's OK!)
- [ ] Click through navigation menu
- [ ] Check these pages load without errors:
  - [ ] Home
  - [ ] Projects
  - [ ] Works
  - [ ] News
  - [ ] Team
  - [ ] Collaborate

### Step 3: Test Admin Login
- [ ] Go to http://localhost:3000/admin/login
- [ ] Enter:
  - Username: `admin`
  - Password: `admin123`
- [ ] Click "Sign In"
- [ ] Verify redirect to dashboard
- [ ] See statistics cards (all showing 0, that's OK!)

---

## PHASE 6: ADD SAMPLE CONTENT (10 minutes)

### Hero Slide
- [ ] In admin, click "Hero Slides"
- [ ] Click "Add New" (if button exists) or note this feature needs implementation
- [ ] Upload an image
- [ ] Add title: "Welcome to Atelier"
- [ ] Add subtitle: "Creating innovative spaces"
- [ ] Save

### Project (if CRUD pages exist)
- [ ] Click "Projects"
- [ ] Click "Create New"
- [ ] Fill in:
  - [ ] Title: "Sample Project"
  - [ ] Description: "A beautiful architectural project"
  - [ ] Slug: "sample-project"
  - [ ] Upload main image
- [ ] Save

### Team Member (if CRUD pages exist)
- [ ] Click "Team"
- [ ] Click "Add New"
- [ ] Fill in:
  - [ ] Name: "John Doe"
  - [ ] Position: "Lead Architect"
  - [ ] Upload photo
  - [ ] Add email
- [ ] Save

---

## PHASE 7: VERIFICATION (5 minutes)

### Test Public Pages
- [ ] Go to http://localhost:3000
- [ ] Verify hero slide shows
- [ ] Check project appears in list
- [ ] Check team member appears

### Test Contact Form
- [ ] Go to /collaborate
- [ ] Fill in form
- [ ] Submit
- [ ] Verify success message
- [ ] Check submission in admin (Collaborations)

### Test Image Upload
- [ ] In admin, try uploading an image
- [ ] Verify upload succeeds
- [ ] Check image displays correctly

---

## PHASE 8: CHANGE ADMIN PASSWORD (3 minutes)

**IMPORTANT: Do this immediately!**

Currently, you need to do this manually in Supabase:
- [ ] Go to Supabase dashboard
- [ ] Go to Table Editor > admins
- [ ] Find your admin user
- [ ] Note: Password changing feature needs to be added to admin panel
- [ ] For now, you can create a new admin with `create-admin.js` using a different password

---

## TROUBLESHOOTING CHECKLIST

### If npm install fails:
- [ ] Delete `node_modules` folder
- [ ] Delete `package-lock.json`
- [ ] Run `npm install` again

### If database setup fails:
- [ ] Check SQL for syntax errors (copy-paste issue)
- [ ] Try running script in smaller sections
- [ ] Check Supabase project status

### If admin login fails:
- [ ] Verify admin user was created (check Supabase table editor)
- [ ] Check .env.local has correct values
- [ ] Clear browser cookies
- [ ] Try incognito/private window
- [ ] Check browser console for errors

### If images don't upload:
- [ ] Verify storage bucket exists
- [ ] Check bucket is public
- [ ] Verify SUPABASE_SERVICE_ROLE_KEY is correct
- [ ] Check Supabase storage policies

### If pages don't load:
- [ ] Check browser console for errors
- [ ] Verify Supabase connection works
- [ ] Check network tab in browser dev tools
- [ ] Restart dev server (`Ctrl+C` then `npm run dev`)

---

## OPTIONAL: DEPLOYMENT CHECKLIST

When ready to deploy:

### Pre-Deployment
- [ ] All content added
- [ ] All images optimized
- [ ] Forms tested
- [ ] Mobile view tested
- [ ] Admin password changed
- [ ] Git repository created

### Netlify Setup
- [ ] Push code to GitHub
- [ ] Connect GitHub to Netlify
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `.next`
- [ ] Add environment variables (same as .env.local)
- [ ] Update NEXTAUTH_URL to production URL
- [ ] Update NEXT_PUBLIC_APP_URL to production URL
- [ ] Deploy

### Post-Deployment
- [ ] Test production site
- [ ] Test admin login
- [ ] Test form submission
- [ ] Test image upload
- [ ] Check mobile responsiveness
- [ ] Verify SSL certificate
- [ ] Set up custom domain (optional)

---

## SUCCESS! 🎉

You've completed setup when:
- ✅ Dev server runs without errors
- ✅ Public pages load
- ✅ Admin login works
- ✅ Can add content through admin
- ✅ Contact form works
- ✅ Images upload successfully

---

## NEXT STEPS

1. **Add Your Content**:
   - Upload hero slides
   - Add real projects
   - Write news articles
   - Add team members

2. **Customize**:
   - Change "ATELIER" to your company name
   - Update colors if needed
   - Add your logo
   - Update footer text

3. **Deploy**:
   - Follow deployment checklist
   - Test production site
   - Share with the world!

---

## NEED HELP?

- **Setup issues**: Check SETUP_GUIDE.md
- **Code questions**: Check PROJECT_COMPLETE.md
- **Quick reference**: Check QUICKSTART.md

---

## REMEMBER

- ⚠️ Never commit .env.local to git
- ⚠️ Change admin password immediately
- ⚠️ Keep service role key secret
- ⚠️ Test on different devices
- ⚠️ Back up database regularly

---

**Happy Building! 🚀**

Print this checklist and check off each step as you complete it!
