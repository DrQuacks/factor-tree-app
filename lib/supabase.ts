import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'set' : 'missing',
    key: supabaseAnonKey ? 'set' : 'missing'
  });
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Database types
export interface UserStats {
  id: string;
  total_games: number;
  games_completed: number;
  total_incorrect_moves: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

export interface GameRecord {
  id: string;
  user_id: string;
  number: number;
  difficulty: string;
  incorrect_moves: number;
  completed: boolean;
  created_at: string;
}

export interface DifficultyStats {
  difficulty: string;
  played: number;
  completed: number;
  avg_incorrect: number;
} 