# Admin Authentication System

## Overview

The admin dashboard now uses **Supabase Authentication** (Email/Password) with the following features:

✅ **Email/Password Login** - Secure authentication via Supabase  
✅ **Admin Registration** - Existing admins can register new admins  
✅ **Session Management** - JWT-based session tokens  
✅ **Logout** - Clear sessions and cookies  
✅ **Role-Based Access** - All admins have full privileges  

---

## Key Features

### 1. **Login** (`/admin/login`)
- Email and password authentication
- Verifies user is active admin in database
- Automatic session creation
- Comprehensive error messages

### 2. **Admin Registration** (`/admin/register`)
- Only accessible to authenticated admins
- Email validation
- Strong password requirement (min 8 characters)
- Automatic account activation
- Success confirmation before redirect

### 3. **Logout**
- One-click logout button in admin header
- Clears Supabase session cookies
- Redirects to login page

### 4. **Session Management**
- Token stored in `sb-access-token` cookie
- Automatic middleware protection
- Prevents unauthorized access to `/admin/*` routes

---

## How It Works

### Authentication Flow

```
User visits /admin/login
     ↓
Enters email & password
     ↓
Supabase.auth.signInWithPassword()
     ↓
Verify user in 'admins' table
     ↓
User is_active = true?
     ↓ YES
Set session cookie (sb-access-token)
     ↓
Redirect to /admin/dashboard
```

### Registration Flow

```
Admin visits /admin/register
     ↓
Enters email, password, full name
     ↓
POST /api/admin/register
     ↓
Supabase.auth.admin.createUser()
     ↓
Insert record in 'admins' table
     ↓
Auto-confirm email
     ↓
Return success message
     ↓
Redirect to dashboard
```

### Logout Flow

```
Admin clicks logout button
     ↓
POST /api/admin/logout
     ↓
Clear sb-access-token cookie
     ↓
Clear sb-refresh-token cookie
     ↓
Redirect to /admin/login
```

---

## File Structure

```
app/
  admin/
    login/
      page.tsx          → Login page (email/password)
    register/
      page.tsx          → Register new admin (for admins only)
    dashboard/
      page.tsx          → Protected dashboard
    (other routes)      → All protected by middleware
  
  api/
    admin/
      register/
        route.ts        → Admin registration endpoint
      logout/
        route.ts        → Logout endpoint

components/
  admin/
    AdminHeader.tsx     → Header with logout & register buttons

middleware.ts           → Checks for sb-access-token cookie

lib/
  supabase/
    auth.ts            → Auth helper functions
```

---

## API Endpoints

### POST `/api/admin/register`

**Request:**
```json
{
  "email": "newadmin@example.com",
  "password": "SecurePassword123",
  "fullName": "John Doe"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "admin": {
    "id": "uuid",
    "email": "newadmin@example.com",
    "fullName": "John Doe"
  }
}
```

**Response (Error):**
```json
{
  "error": "Email already exists"
}
```

### POST `/api/admin/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Security Features

### 1. **Middleware Protection**
- All `/admin/*` routes require valid session token
- Automatic redirect to login if unauthorized
- Token validated on every request

### 2. **Password Requirements**
- Minimum 8 characters
- Checked on registration
- Hashed by Supabase (bcrypt)

### 3. **Account Status**
- Admins must be marked `is_active = true`
- Inactive admins cannot login
- Can be deactivated without deleting account

### 4. **Email Verification**
- Auto-confirmed for admin registrations
- No manual verification needed
- Prevents typos in registration

### 5. **Session Management**
- HTTPOnly cookies (secure)
- Automatic expiration
- Refresh token for long sessions
- Cleared on logout

---

## Admin Database Table

The `admins` table stores:

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY,              -- From Supabase Auth
  email VARCHAR(255) NOT NULL,      -- Login email
  full_name VARCHAR(255),           -- Display name
  role VARCHAR(50) DEFAULT 'admin', -- Role type
  is_active BOOLEAN DEFAULT true,   -- Enable/disable login
  last_login TIMESTAMP,             -- Last login time
  created_at TIMESTAMP,             -- Registration time
  updated_at TIMESTAMP              -- Last update
);
```

---

## Adding Your First Admin

### Option 1: Via Supabase Dashboard (Initial Setup)

1. Go to **Supabase Dashboard**
2. **SQL Editor** → New Query
3. Run this SQL:

```sql
-- Create Supabase auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'YOUR_UUID_HERE',  -- Generate a UUID v4
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Add admin record
INSERT INTO admins (
  id,
  email,
  full_name,
  is_active
) VALUES (
  'YOUR_UUID_HERE',  -- Same UUID as above
  'admin@example.com',
  'Admin User',
  true
);
```

### Option 2: Via Register Page

1. Login with first admin
2. Click "Register Admin" in header
3. Enter new admin details
4. New admin can login immediately

---

## Troubleshooting

### "Access denied. Admin account required."

**Cause:** User exists in Supabase Auth but not in `admins` table

**Fix:**
1. Go to Supabase Dashboard
2. **SQL Editor** → Run:
```sql
INSERT INTO admins (id, email, full_name, is_active)
SELECT id, email, email, true FROM auth.users 
WHERE email = 'admin@example.com'
AND NOT EXISTS (
  SELECT 1 FROM admins WHERE admins.email = auth.users.email
);
```

### "Invalid email or password"

**Cause:** Wrong credentials or user doesn't exist

**Fix:** 
1. Verify email is correct
2. Reset password via Supabase Dashboard
3. Check if account is active (`is_active = true`)

### Stuck on login page after form submission

**Cause:** Middleware can't access session token

**Fix:**
1. Check browser DevTools → Network → Check `/api/admin/register` response
2. Verify Supabase environment variables are set
3. Check browser cookies (should have `sb-access-token`)

### Can't access admin panel after login

**Cause:** Session cookie not being set

**Fix:**
1. Clear all cookies/cache
2. Logout and login again
3. Check Supabase project settings → Auth → URL Configuration

---

## Best Practices

✅ **Do:**
- Use strong, unique passwords (8+ characters)
- Keep email addresses current
- Deactivate unused admin accounts
- Review last_login times periodically
- Logout when finished

❌ **Don't:**
- Share admin credentials
- Use the same password as other services
- Leave browser logged in on public computers
- Delete admin accounts (deactivate instead)

---

## User Experience Features

### Loading States
- Submit buttons show loading spinner
- Disabled during submission
- Prevents duplicate submissions

### Error Messages
- Clear, descriptive error messages
- Field-level validation
- Email format checking
- Password mismatch detection

### Success States
- Green success message on registration
- Auto-redirect after confirmation
- Smooth transitions

### Visual Design
- Black and white color scheme
- Consistent with site branding
- Responsive on all devices
- Accessible form labels

---

## Next Steps

1. **Setup First Admin:**
   - Use SQL method above to create initial admin
   - Or ask us to do it

2. **Test Login:**
   - Go to `/admin/login`
   - Enter credentials
   - Should redirect to dashboard

3. **Register More Admins:**
   - Click "Register Admin" button
   - Enter new admin details
   - New admin can login immediately

4. **Start Managing Content:**
   - All admin features available
   - Full CRUD on all content sections

---

## Support

For issues or questions:
- Check troubleshooting section above
- Review browser console for errors
- Check Supabase logs in dashboard
- Verify environment variables are set

All authentication is powered by **Supabase**, a secure, production-ready authentication system.
