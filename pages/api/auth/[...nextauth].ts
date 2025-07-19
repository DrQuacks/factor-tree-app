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
        
        if (error) {
          console.error('Error creating user stats:', error);
          // Don't block sign in if this fails
        }
      }
      return true;
    },
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
}) 