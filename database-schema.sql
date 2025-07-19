-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id TEXT PRIMARY KEY, -- Using email as primary key
  total_games INTEGER DEFAULT 0,
  games_completed INTEGER DEFAULT 0,
  total_incorrect_moves INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_records table
CREATE TABLE IF NOT EXISTS game_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Using email as foreign key
  number INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
  incorrect_moves INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_records_user_id ON game_records(user_id);
CREATE INDEX IF NOT EXISTS idx_game_records_number ON game_records(number);
CREATE INDEX IF NOT EXISTS idx_game_records_created_at ON game_records(created_at);

-- Create a view for difficulty breakdown
CREATE OR REPLACE VIEW difficulty_stats AS
SELECT 
  user_id,
  difficulty,
  COUNT(*) as played,
  COUNT(*) FILTER (WHERE completed = true) as completed,
  ROUND(AVG(incorrect_moves) FILTER (WHERE completed = true), 1) as avg_incorrect
FROM game_records
GROUP BY user_id, difficulty;

-- Create a function to update user stats when a game is completed
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user_stats
  INSERT INTO user_stats (id, total_games, games_completed, total_incorrect_moves, current_streak, longest_streak)
  VALUES (
    NEW.user_id,
    1,
    CASE WHEN NEW.completed THEN 1 ELSE 0 END,
    NEW.incorrect_moves,
    CASE WHEN NEW.completed THEN 1 ELSE 0 END,
    CASE WHEN NEW.completed THEN 1 ELSE 0 END
  )
  ON CONFLICT (id) DO UPDATE SET
    total_games = user_stats.total_games + 1,
    games_completed = user_stats.games_completed + CASE WHEN NEW.completed THEN 1 ELSE 0 END,
    total_incorrect_moves = user_stats.total_incorrect_moves + NEW.incorrect_moves,
    updated_at = NOW();
  
  -- Update streaks (simplified version - you might want to make this more sophisticated)
  IF NEW.completed THEN
    UPDATE user_stats 
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1)
    WHERE id = NEW.user_id;
  ELSE
    UPDATE user_stats 
    SET current_streak = 0
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user stats
CREATE TRIGGER trigger_update_user_stats
  AFTER INSERT ON game_records
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Enable Row Level Security (RLS)
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (disabled for now since we're not using Supabase auth)
-- We'll handle security at the application level
ALTER TABLE user_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE game_records DISABLE ROW LEVEL SECURITY;

-- Create a function to get number history for a user
CREATE OR REPLACE FUNCTION get_number_history(user_email TEXT, target_number INTEGER)
RETURNS TABLE (
  number INTEGER,
  difficulty TEXT,
  incorrect_moves INTEGER,
  completed BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gr.number,
    gr.difficulty,
    gr.incorrect_moves,
    gr.completed,
    gr.created_at
  FROM game_records gr
  WHERE gr.user_id = user_email AND gr.number = target_number
  ORDER BY gr.created_at DESC;
END;
$$ LANGUAGE plpgsql; 