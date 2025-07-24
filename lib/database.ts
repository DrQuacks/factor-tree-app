import { supabase, UserStats, GameRecord, DifficultyStats } from './supabase';

// Get user statistics
export async function getUserStats(userId: string): Promise<UserStats | null> {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }

  return data;
}

// Record a new game
export async function recordGame(
  userId: string,
  number: number,
  difficulty: string,
  incorrectMoves: number,
  completed: boolean
): Promise<boolean> {
  const { error } = await supabase
    .from('game_records')
    .insert({
      user_id: userId,
      number,
      difficulty,
      incorrect_moves: incorrectMoves,
      completed
    });

  if (error) {
    console.error('Error recording game:', error);
    return false;
  }

  return true;
}

// Get recent games for a user
export async function getRecentGames(userId: string, limit: number = 5): Promise<GameRecord[]> {
  const { data, error } = await supabase
    .from('game_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent games:', error);
    return [];
  }

  return data || [];
}

// Get difficulty breakdown for a user
export async function getDifficultyStats(userId: string): Promise<DifficultyStats[]> {
  const { data, error } = await supabase
    .from('difficulty_stats')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching difficulty stats:', error);
    return [];
  }

  return data || [];
}

// Get number history for a specific number
export async function getNumberHistory(userId: string, number: number): Promise<GameRecord[]> {
  const { data, error } = await supabase
    .rpc('get_number_history', {
      user_email: userId,
      target_number: number
    });

  if (error) {
    console.error('Error fetching number history:', error);
    return [];
  }

  return data || [];
}

// Get all unique numbers a user has played
export async function getAllUserNumbers(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('game_records')
    .select('number')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user numbers:', error);
    return [];
  }

  // Extract unique numbers
  const uniqueNumbers = Array.from(new Set(data?.map(record => record.number) || []));
  return uniqueNumbers.sort((a, b) => a - b);
}

// Get how many times a user has played a specific number
export async function getNumberPlayCount(userId: string, number: number): Promise<number> {
  const { count, error } = await supabase
    .from('game_records')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('number', number);

  if (error) {
    console.error('Error fetching number play count:', error);
    return 0;
  }

  return count || 0;
}

// Create or update user stats (fallback if trigger doesn't work)
export async function upsertUserStats(userId: string): Promise<boolean> {
  // First, get the current stats from game_records
  const { data: games, error: gamesError } = await supabase
    .from('game_records')
    .select('*')
    .eq('user_id', userId);

  if (gamesError) {
    console.error('Error fetching games for stats:', gamesError);
    return false;
  }

  // Calculate stats
  const totalGames = games?.length || 0;
  const gamesCompleted = games?.filter(g => g.completed).length || 0;
  const totalIncorrectMoves = games?.reduce((sum, g) => sum + g.incorrect_moves, 0) || 0;

  // Calculate streaks (now: most consecutive games completed with zero incorrect moves)
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  if (games) {
    // Sort by created_at descending to process most recent first
    const sortedGames = games.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    for (const game of sortedGames) {
      if (game.completed && game.incorrect_moves === 0) {
        tempStreak++;
        if (tempStreak === 1) currentStreak = tempStreak; // Most recent streak
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
  }

  // Upsert the stats
  const { error } = await supabase
    .from('user_stats')
    .upsert({
      id: userId,
      total_games: totalGames,
      games_completed: gamesCompleted,
      total_incorrect_moves: totalIncorrectMoves,
      current_streak: currentStreak,
      longest_streak: longestStreak
    }, { onConflict: 'id' });

  if (error) {
    console.error('Error upserting user stats:', error);
    return false;
  }

  return true;
} 