# Create Project Troubleshooting Guide

## Quick Diagnostic Checklist

Run these checks in order to identify the issue:

### 1. **Check if Database Table Exists**
   - Go to Supabase Dashboard → **Database** → **Tables**
   - Look for `projects` table
   - ❌ If missing → Run: `/scripts/PROJECTS_TABLE_SETUP.sql`
   - ✅ If exists → Move to step 2

### 2. **Check if Storage Bucket Exists**
   - Go to Supabase Dashboard → **Storage**
   - Look for `projects` bucket
   - ❌ If missing → Create new bucket named `projects` and set to **Public**
   - ✅ If exists → Move to step 3

### 3. **Run Diagnostic Queries**
   - Go to Supabase Dashboard → **SQL Editor**
   - Create new query and copy contents from: `/scripts/PROJECTS_DIAGNOSTIC.sql`
   - Run the queries
   - Review results for any issues

### 4. **Check Authentication**
   - Log in as admin first (must be authenticated)
   - Try creating a project
   - ❌ If "Unauthorized" error → Check admin login session
   - ✅ If other error → Continue to step 5

### 5. **Check Browser Console**
   - Open **DevTools** (F12)
   - Click **Console** tab
   - Look for error messages when submitting form
   - Take note of the exact error

### 6. **Check Network Tab**
   - In DevTools, click **Network** tab
   - Try creating project
   - Click the `/api/projects` request
   - Check **Response** tab for error message
   - Common errors:
     - `"Missing required fields"` → Form data not sent correctly
     - `"new row violates row-level security policy"` → RLS not set up
     - `"relation \"projects\" does not exist"` → Table not created
     - `"Unauthorized"` → Not logged in

---

## Common Issues & Solutions

### Issue 1: "new row violates row-level security policy"
**Cause:** RLS policies not set up or incorrect
**Solution:**
```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Add policies (run in SQL Editor)
CREATE POLICY "Allow authenticated insert projects" ON projects
FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated read all projects" ON projects
FOR SELECT USING (auth.role() = 'authenticated_user');
```

### Issue 2: "relation \"projects\" does not exist"
**Cause:** Table not created
**Solution:** Run `/scripts/PROJECTS_TABLE_SETUP.sql` in SQL Editor

### Issue 3: "Failed to upload image: No bucket"
**Cause:** Projects storage bucket not created
**Solution:** 
- Go to Supabase Dashboard → Storage
- Click "New Bucket"
- Name: `projects`
- Set to **Public**
- Click Create

### Issue 4: "Unauthorized - please login first"
**Cause:** Authentication cookie not set
**Solution:**
- Make sure you're logged in as admin
- Check `/admin/login` page
- Verify session exists

### Issue 5: Form won't submit / submit button disabled
**Cause:** Image not uploaded
**Solution:**
- Click "Upload Project Image" button
- Select an image file
- Wait for upload to complete
- Image preview should appear
- Then submit button will be enabled

### Issue 6: "Missing required fields"
**Cause:** One or more required fields empty
**Solution:** Fill in all required fields:
- ✓ Title
- ✓ Slug
- ✓ Location
- ✓ Description
- ✓ Image (must upload)

---

## Step-by-Step Setup (If Starting Fresh)

### 1. Create Projects Table
```
Go to: Supabase Dashboard → SQL Editor → New Query
Paste: /scripts/PROJECTS_TABLE_SETUP.sql
Click: Run
```

### 2. Create Storage Bucket
```
Go to: Supabase Dashboard → Storage
Click: New Bucket
Name: projects
Access: Public
Click: Create
```

### 3. Test Connection
```
Go to: /admin/projects
Click: Add Project button
Fill form with test data:
  Title: Test Project
  Slug: test-project
  Location: Test Location
  Description: This is a test project description
  Upload an image
Click: Create Project
```

### 4. Verify Success
- You should be redirected to `/admin/projects`
- New project should appear in list
- You should see it on `/projects` (public page)

---

## Debug Logs to Check

### Backend Logs (Supabase)
- Go to Supabase Dashboard → Logs
- Search for `projects` or `POST /api/projects`
- Look for error messages

### Browser Console
- Open DevTools (F12)
- Console tab shows:
  - `"Submitting project:"` message
  - `"Project created successfully"` message
  - Any error stack traces

### Network Inspector
- DevTools → Network tab
- Filter by `projects`
- Click the request
- Response shows API error details

---

## If Still Not Working

Provide this information:

1. What error message appears? (screenshot)
2. What's in the browser console? (screenshot)
3. Does `projects` table exist in database?
4. Does `projects` bucket exist in storage?
5. Are you logged in as admin?
6. Did you run `/scripts/PROJECTS_TABLE_SETUP.sql`?
