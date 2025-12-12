# Netlify Deployment Guide

## 📋 Netlify Settings

Fill in these values on the Netlify deployment page:

### Basic Build Settings
- **Branch to deploy**: `main` (or your default branch name)
- **Base directory**: (leave empty)
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Functions directory**: `netlify/functions` (already set)

## 🔐 Environment Variables

Go to **Site settings → Environment variables** and add these:

### Required Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://loetbmdkawhlkamtqjij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZXRibWRrYXdobGthbXRxamlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzA0MDEsImV4cCI6MjA4MTA0NjQwMX0.ASBJf_1ZD-Jb7BZZcnKSLT2KpybOkHFSEctJB_tvbzE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZXRibWRrYXdobGthbXRxamlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDQwMSwiZXhwIjoyMDgxMDQ2NDAxfQ.JwOwK2Lj5DTUIy6t-ZMqb-eBbTEnyslEJR15hYbsORA

# NextAuth Configuration
NEXTAUTH_SECRET=generate-a-random-secret-key-here-at-least-32-chars
NEXTAUTH_URL=https://your-site-name.netlify.app

# App Configuration  
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app

# Node Environment
NODE_ENV=production
```

### Generate NEXTAUTH_SECRET
Run this command in your terminal to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📦 Required Netlify Plugin

The `@netlify/plugin-nextjs` plugin is automatically configured in `netlify.toml`.

Netlify will install it during deployment.

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### 2. Connect to Netlify
1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure the settings as shown above
5. Add all environment variables
6. Click "Deploy site"

### 3. Update Environment Variables
After first deployment:
1. Go to **Site settings → Environment variables**
2. Update `NEXTAUTH_URL` with your actual Netlify URL: `https://your-site-name.netlify.app`
3. Update `NEXT_PUBLIC_APP_URL` with the same URL
4. Trigger a redeploy: **Deploys → Trigger deploy → Deploy site**

### 4. Custom Domain (Optional)
1. Go to **Domain settings**
2. Click "Add custom domain"
3. Follow instructions to configure DNS

## 🔧 Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure all environment variables are set correctly
- Verify `NODE_VERSION` is 18 or higher

### 404 Errors
- Check that publish directory is `.next`
- Ensure redirects in `netlify.toml` are configured
- Verify the `@netlify/plugin-nextjs` plugin is active

### API Routes Not Working
- Ensure environment variables are set
- Check function logs in Netlify dashboard
- Verify Supabase credentials are correct

### Authentication Issues
- Ensure `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your deployed URL
- Check that cookies are enabled

## 📊 Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] All pages are accessible
- [ ] Images load properly
- [ ] Admin login works
- [ ] API routes respond correctly
- [ ] Contact form submits successfully
- [ ] Database queries work
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Verify SEO metadata

## 🔄 Continuous Deployment

Netlify will automatically rebuild your site when you push to your main branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## 📝 Important Notes

1. **Database Setup**: Make sure you've run the SQL schema in Supabase first
2. **Admin User**: Create an admin user before trying to log in
3. **Storage**: Configure Supabase storage buckets and policies
4. **Environment**: Always use production values in Netlify environment variables
5. **HTTPS**: Netlify automatically provides SSL certificates

## 🆘 Support

If you encounter issues:
1. Check Netlify build logs
2. Check Netlify function logs
3. Check browser console
4. Review Supabase logs
5. Contact Netlify support if needed

---

**Deployment Date**: December 13, 2025
**Framework**: Next.js 16.0.10
**Platform**: Netlify
