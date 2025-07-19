# Google OAuth Authentication Setup

This guide will help you set up Google OAuth authentication for your Factor Tree app.

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Choose "Web application" as the application type
7. Add these authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
8. Copy the Client ID and Client Secret

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

3. Generate a random secret for NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

## Step 3: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Click "Login/Sign Up" in the navigation menu
3. You should be redirected to Google's OAuth consent screen
4. After signing in, you'll be redirected back to your app

## Features Implemented

- ✅ Google OAuth authentication
- ✅ Custom sign-in page
- ✅ User profile display with avatar
- ✅ Sign out functionality
- ✅ Responsive design matching your app's theme

## Next Steps (Optional)

If you want to add user-specific features later, you can:

1. Add a database (PostgreSQL, MongoDB, etc.)
2. Store user progress and statistics
3. Add personalized difficulty settings
4. Implement high scores and achievements

## Troubleshooting

- **"Invalid redirect URI"**: Make sure your redirect URI in Google Console matches exactly
- **"Client ID not found"**: Verify your environment variables are set correctly
- **"Session not working"**: Check that NEXTAUTH_SECRET is set and unique 