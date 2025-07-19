# Supabase Database Setup Guide

## Step 1: Set Up Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use an existing one
3. Note down your project URL and anon key

## Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Create Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL script

## Step 4: Configure Authentication

Since you're using NextAuth.js, you need to link it with Supabase:

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Add your domain to **Site URL** and **Redirect URLs**:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)

## Step 5: Update NextAuth Configuration

Update your `pages/api/auth/[...nextauth].ts` to include Supabase session handling:

```typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from "../../../lib/supabase"

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Create user record in Supabase if it doesn't exist
      if (user.email) {
        const { error } = await supabase
          .from('user_stats')
          .upsert({ 
            id: user.email,
            total_games: 0,
            games_completed: 0,
            total_incorrect_moves: 0,
            current_streak: 0,
            longest_streak: 0
          }, { onConflict: 'id' });
        
        if (error) console.error('Error creating user stats:', error);
      }
      return true;
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
})
```

## Step 6: Update Game Logic

You'll need to update your game components to record games. Add this to your main game component:

```typescript
import { recordGame } from '../lib/database';

// When a game is completed or abandoned
const handleGameEnd = async (completed: boolean) => {
  if (session?.user?.email) {
    await recordGame(
      session.user.email,
      currentNumber,
      currentDifficulty,
      incorrectMoves,
      completed
    );
  }
};
```

## Step 7: Test the Integration

1. Start your development server
2. Sign in with Google
3. Play a game and complete it
4. Check your dashboard - you should see real data!

## Database Features

✅ **User Statistics**: Total games, completion rate, streaks
✅ **Game Records**: Every game attempt with performance data
✅ **Difficulty Breakdown**: Performance by difficulty level
✅ **Number History**: Track how many times you've played each number
✅ **Recent Games**: Last 5 games with completion status

## Next Steps

- Add real-time updates using Supabase subscriptions
- Create number-specific analytics pages
- Add achievements and milestones
- Implement leaderboards

## Troubleshooting

- **"Table doesn't exist"**: Make sure you ran the SQL schema
- **"RLS policy violation"**: Check that RLS policies are set up correctly
- **"User not found"**: Ensure the signIn callback creates user records 