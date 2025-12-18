# Collaborations Feature - Setup & Troubleshooting Guide

## 📋 Overview
The collaborations feature allows visitors to submit collaboration requests through the public website. Admins can view and manage these requests in the admin dashboard.

## 🚀 Setup Instructions

### Step 1: Create the Database Table

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open the file: `scripts/COLLABORATIONS_SETUP.sql`
4. Copy and paste the entire SQL script
5. Click **Run** to execute

### Step 2: Verify Setup

After running the SQL script, verify:

```sql
-- Check table exists
SELECT * FROM collaborations LIMIT 1;

-- Check RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'collaborations';

-- Check policies exist
SELECT policyname FROM pg_policies 
WHERE tablename = 'collaborations';
```

You should see:
- ✅ Table exists with no errors
- ✅ RLS is enabled (`relrowsecurity = true`)
- ✅ 4 policies: public insert, authenticated select/update/delete

### Step 3: Test the Feature

#### Test Public Submission (Website)
1. Visit `/collaborate` page on your website
2. Fill out the collaboration form
3. Submit the request
4. Check if it appears in the database

#### Test Admin Dashboard
1. Log in to admin dashboard
2. Navigate to `/admin/collaborations`
3. Verify you can see the submitted requests
4. Check if the error display works if table is empty

## 🔍 Troubleshooting

### Issue 1: "Failed to Load Collaborations" Error

**Symptoms:**
- Admin page shows red error message
- Error says "Failed to fetch collaborations"

**Causes & Solutions:**

#### Cause A: Table doesn't exist
**Check:**
```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'collaborations'
);
```

**Solution:** Run `scripts/COLLABORATIONS_SETUP.sql`

#### Cause B: RLS blocking requests
**Check:**
```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'collaborations';
```

**Solution:** Ensure these policies exist:
- `allow_public_insert_collaborations` - FOR INSERT
- `allow_authenticated_select_collaborations` - FOR SELECT
- `allow_authenticated_update_collaborations` - FOR UPDATE
- `allow_authenticated_delete_collaborations` - FOR DELETE

If missing, re-run section 5 of the setup script.

#### Cause C: API endpoint issue
**Check:** Open browser console and look for:
- `🔄 Fetching collaborations...` - Request started
- `✅ Fetched collaborations: [...]` - Success
- `❌ Error fetching collaborations:` - Error details

**Solution:** Check API logs in `/api/collaborate/route.ts`

#### Cause D: Authentication issue
**Check:** Verify you're logged in as admin
```sql
SELECT * FROM auth.users;
```

**Solution:** Log in again at `/admin/login`

### Issue 2: "No collaboration requests yet" (Empty State)

**Symptoms:**
- Page loads successfully
- Shows "No collaboration requests yet"
- But you know there are requests in the database

**Causes & Solutions:**

#### Cause A: RLS blocking SELECT
**Test query:**
```sql
-- This should return rows (admin query)
SELECT * FROM collaborations;
```

**Solution:** Check if authenticated SELECT policy exists:
```sql
CREATE POLICY "allow_authenticated_select_collaborations" 
  ON collaborations 
  FOR SELECT 
  USING (auth.role() = 'authenticated');
```

#### Cause B: API returning wrong format
**Check:** Browser console should show:
```javascript
✅ Fetched collaborations: [{id: "...", name: "..."}]
```

**Solution:** API should return `{ data: [...] }` format

### Issue 3: Public Form Not Submitting

**Symptoms:**
- User fills form on `/collaborate`
- Submit button doesn't work or shows error

**Causes & Solutions:**

#### Cause A: Public INSERT policy missing
**Check:**
```sql
SELECT policyname FROM pg_policies 
WHERE tablename = 'collaborations' 
AND cmd = 'INSERT';
```

**Solution:** Ensure public insert policy exists:
```sql
CREATE POLICY "allow_public_insert_collaborations" 
  ON collaborations 
  FOR INSERT 
  WITH CHECK (true);
```

#### Cause B: Validation error
**Check:** Browser console for validation errors

**Solution:** Ensure all required fields are filled:
- name (required)
- email (required)
- description (required)
- message (required)

## 🧪 Test Queries

### Insert Test Data
```sql
INSERT INTO collaborations (name, email, description, message, status)
VALUES 
  ('John Doe', 'john@example.com', 'Web Design Project', 'I would like to collaborate on a website redesign.', 'new'),
  ('Jane Smith', 'jane@example.com', 'Architecture Project', 'Looking for architectural design services.', 'pending'),
  ('Bob Wilson', 'bob@example.com', 'Interior Design', 'Need help with office interior design.', 'reviewed');
```

### View All Collaborations
```sql
SELECT 
  id,
  name,
  email,
  company,
  project_type,
  budget,
  status,
  created_at
FROM collaborations
ORDER BY created_at DESC;
```

### Count by Status
```sql
SELECT 
  status,
  COUNT(*) as count
FROM collaborations
GROUP BY status
ORDER BY count DESC;
```

### Recent Requests (Last 7 Days)
```sql
SELECT 
  name,
  email,
  status,
  created_at
FROM collaborations
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

## 📊 Database Schema

```sql
CREATE TABLE collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),              -- Optional
  phone VARCHAR(50),                  -- Optional
  project_type VARCHAR(100),          -- Optional
  budget VARCHAR(100),                -- Optional
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',   -- new, pending, reviewed, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 RLS Policies Summary

| Policy | Operation | Who | Purpose |
|--------|-----------|-----|---------|
| `allow_public_insert_collaborations` | INSERT | Anyone | Let visitors submit requests |
| `allow_authenticated_select_collaborations` | SELECT | Authenticated | Let admins view requests |
| `allow_authenticated_update_collaborations` | UPDATE | Authenticated | Let admins change status |
| `allow_authenticated_delete_collaborations` | DELETE | Authenticated | Let admins remove requests |

## 📝 Status Values

- **new**: Just submitted, not yet reviewed
- **pending**: Under review
- **reviewed**: Admin has reviewed
- **accepted**: Collaboration accepted
- **rejected**: Collaboration declined

## 🎯 Next Steps

After setup:
1. Test public form submission
2. Verify admin can see requests
3. Test status updates
4. Set up email notifications (optional)
5. Add more fields if needed

## 🆘 Still Having Issues?

1. Check browser console for errors
2. Check Supabase logs (Project Settings → API → Logs)
3. Verify environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Test API endpoint directly: `GET /api/collaborate`
5. Check if admin is authenticated: `POST /api/auth/[...nextauth]`
