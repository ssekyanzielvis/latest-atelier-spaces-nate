# Environment Variables Setup for Render Deployment

Your application is failing because the required environment variables are not set in Render. Follow these steps:

## Required Environment Variables

You need to set these in your Render dashboard:

### 1. Supabase Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://loetbmdkawhlkamtqjij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

### 2. NextAuth Secret (if still used)
```
NEXTAUTH_SECRET=<generate-a-random-secret>
```

### 3. Other Required Variables
```
NEXTAUTH_URL=https://latest-atelier-spaces-nate.onrender.com
```

## How to Set Environment Variables in Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your web service: `latest-atelier-spaces-nate`
3. Click on **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**
5. Add each variable one by one:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://loetbmdkawhlkamtqjij.supabase.co`
   - Click **"Save Changes"**

6. Repeat for all other variables

## Where to Find Your Supabase Keys

1. Go to https://supabase.com/dashboard
2. Select your project: `loetbmdkawhlkamtqjij`
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → Use as `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

## Generate NextAuth Secret

Run this command locally:
```bash
openssl rand -base64 32
```

Use the output as your `NEXTAUTH_SECRET`

## After Setting Variables

1. Render will automatically redeploy your application
2. Wait for the deployment to complete
3. Your site should now work at: https://latest-atelier-spaces-nate.onrender.com

## Troubleshooting

If you still see errors:
1. Check that all variable names are spelled correctly (case-sensitive)
2. Make sure `NEXT_PUBLIC_` prefix is included for client-side variables
3. Verify your Supabase project is active
4. Check Render logs for specific error messages

## Security Note

⚠️ **NEVER** commit your `SUPABASE_SERVICE_ROLE_KEY` or `NEXTAUTH_SECRET` to GitHub. These are already in `.env.local` which is gitignored.
