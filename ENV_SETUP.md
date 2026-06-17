# Environment Variables Setup Guide

This guide explains how to set up environment variables for the Goldwing After Sales Service Record application.

## Overview

The application requires several environment variables to function properly. These are used for:
- OAuth authentication
- Database connection
- API keys and secrets
- Application configuration

## Required Environment Variables

See `.env.example` for a complete list of all environment variables.

### Critical Variables (Required for Production)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_ID` | Manus OAuth Application ID | `your-app-id` |
| `JWT_SECRET` | Secret key for session signing | `your-secret-key` |
| `DATABASE_URL` | MySQL database connection string | `mysql://user:pass@host/db` |
| `OAUTH_SERVER_URL` | Manus OAuth server URL | `https://api.manus.im` |
| `BUILT_IN_FORGE_API_URL` | Manus API base URL | `https://api.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | Manus API authentication key | `your-api-key` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_OAUTH_PORTAL_URL` | OAuth portal URL | `https://api.manus.im` |
| `VITE_APP_TITLE` | Application title | `Goldwing After Sales Service Record` |
| `VITE_APP_LOGO` | Application logo URL | (empty) |
| `OWNER_OPEN_ID` | Owner's Manus Open ID | (empty) |
| `OWNER_NAME` | Owner's name | (empty) |
| `VITE_ANALYTICS_ENDPOINT` | Analytics service URL | (empty) |
| `VITE_ANALYTICS_WEBSITE_ID` | Analytics website ID | (empty) |

## Setup Instructions

### For Render Deployment

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your service: `myanmarglodwing-aftersaleservices`
3. Navigate to **Settings** → **Environment**
4. Add each required environment variable:
   - Click **Add Environment Variable**
   - Enter **Key** and **Value**
   - Click **Save**
5. The service will automatically redeploy with the new variables

### For Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your values:
   ```
   VITE_APP_ID=your-app-id
   JWT_SECRET=your-secret-key
   DATABASE_URL=mysql://user:pass@localhost/goldwing
   OAUTH_SERVER_URL=https://api.manus.im
   ...
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### For GitHub Actions / CI/CD

1. Go to GitHub repository Settings → **Secrets and variables** → **Actions**
2. Add each environment variable as a secret:
   - Click **New repository secret**
   - Name: `RENDER_DEPLOY_HOOK` (for automatic Render deployment)
   - Value: Your Render deploy hook URL
3. The workflow will automatically deploy when you push to `main` branch

## Environment Variable Validation

The application validates required environment variables on startup:
- In **production**, missing variables will cause an error and log to console
- In **development**, missing variables will be logged but won't block startup
- Check server logs for validation status

## Security Best Practices

1. **Never commit `.env` files** - They are already in `.gitignore`
2. **Use strong secrets** - For `JWT_SECRET`, use a random string of at least 32 characters
3. **Rotate keys regularly** - Update `BUILT_IN_FORGE_API_KEY` periodically
4. **Use different values per environment** - Don't reuse production secrets in development
5. **Restrict access** - Only authorized users should access environment variables in Render

## Troubleshooting

### "OAUTH_SERVER_URL is not configured"
- Solution: Add `OAUTH_SERVER_URL=https://api.manus.im` to your environment

### "DATABASE_URL is not configured"
- Solution: Add your MySQL connection string to `DATABASE_URL`

### "VITE_APP_ID is not configured"
- Solution: Get your Manus App ID and add it to `VITE_APP_ID`

### Application won't start
- Check Render logs: Dashboard → Service → Logs
- Verify all required variables are set
- Check variable values are correct (no typos)

## Support

For issues with environment variables:
1. Check `.env.example` for the correct variable names
2. Review Render logs for specific error messages
3. Verify values are set correctly in Render dashboard
4. Contact Manus support if you need API keys or credentials

## References

- [Render Environment Variables Documentation](https://render.com/docs/environment-variables)
- [Manus OAuth Documentation](https://docs.manus.im)
- [MySQL Connection String Format](https://dev.mysql.com/doc/connector-python/en/connector-python-connectargs.html)
