# 🚀 Complete Projects Setup Guide

## ✅ Step-by-Step Setup (Follow Exactly)

### Step 1: Create Database Table
1. Open **Supabase Dashboard**
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste from: `scripts/PROJECTS_COMPLETE_SETUP.sql`
5. Click **Run** (or press Ctrl+Enter)
6. ✅ You should see: "Projects table setup complete!"

### Step 2: Create Storage Bucket
1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **New Bucket** button
3. Fill in:
   - **Name:** `projects` (exactly this name)
   - **Public bucket:** ✅ Check this box
   - **File size limit:** 50MB
4. Click **Create Bucket**
5. ✅ Bucket `projects` should now appear in the list

### Step 3: Verify Setup
Run these checks in SQL Editor:

```sql
-- Check table exists
SELECT * FROM projects LIMIT 1;

-- Check bucket exists  
SELECT * FROM storage.buckets WHERE name = 'projects';
```

Both queries should run without errors.

### Step 4: Test Create Project
1. Go to `/admin/login` - **Login as admin first!**
2. Go to `/admin/projects`
3. Click **Add Project** or **Create New Project** button
4. Fill in the form:
   - Title: "Test Project"
   - Slug: "test-project"
   - Location: "Nairobi, Kenya"
   - Description: "This is a test project to verify everything works"
   - Click **Upload Project Image** → select any image
   - Wait for upload to complete
5. Click **Create Project**
6. ✅ Should redirect to `/admin/projects` with new project in list

---

## 🔧 If Still Not Working

### Issue: "new row violates row-level security policy"
**Solution:** Make sure you're **logged in as admin**
```
1. Go to /admin/login
2. Enter admin credentials
3. Try creating project again
```

### Issue: "No bucket 'projects'"
**Solution:** Create the storage bucket (see Step 2 above)

### Issue: "relation 'projects' does not exist"
**Solution:** Run the SQL script (see Step 1 above)

### Issue: Form won't submit / button disabled
**Solution:** 
1. Make sure image is uploaded (preview should show)
2. All required fields filled (Title, Slug, Location, Description)
3. Check browser console (F12) for errors

---

## 📝 Quick Test Script

Run this in Supabase SQL Editor to test everything:

```sql
-- Test 1: Insert a project (simulates admin creating)
INSERT INTO projects (
  title, slug, location, description, image
) VALUES (
  'SQL Test Project',
  'sql-test-' || floor(random() * 1000)::text,
  'Test Location',
  'This is a test project created via SQL',
  'https://via.placeholder.com/800x600'
);

-- Test 2: Read all projects
SELECT id, title, slug, is_published FROM projects;

-- Test 3: Read published projects only (simulates public view)
SELECT id, title, slug FROM projects WHERE is_published = true;

-- Test 4: Clean up test data
DELETE FROM projects WHERE title = 'SQL Test Project';
```

All 4 tests should complete successfully.

---

## ✅ Final Checklist

- [ ] SQL script executed successfully
- [ ] Storage bucket `projects` created and set to Public
- [ ] Logged in as admin at `/admin/login`
- [ ] Can view `/admin/projects` page
- [ ] Can click "Add Project" button
- [ ] Form opens with all fields
- [ ] Can upload image (preview shows)
- [ ] Can submit form without errors
- [ ] New project appears in list
- [ ] Can view project on `/projects` (public page)
- [ ] Can edit project
- [ ] Can delete project

If all boxes checked: **✅ Everything is working!**
