-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  current_weight DECIMAL(5, 2) NOT NULL DEFAULT 0,
  goal_weight DECIMAL(5, 2) NOT NULL,
  goal_calorie_intake INT NOT NULL DEFAULT 2500,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Weight entries table
CREATE TABLE IF NOT EXISTS weight_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight DECIMAL(5, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Daily calorie logs
CREATE TABLE IF NOT EXISTS calorie_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  calories_consumed INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  requirement_type VARCHAR(50), -- 'weight_gained', 'streak', 'calorie_goal', 'exercise'
  requirement_value INT,
  xp_reward INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User achievements (unlocked)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- XP and levels
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_xp INT DEFAULT 0,
  current_level INT DEFAULT 1,
  consistency_streak INT DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Workout plans
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  duration_weeks INT,
  focus_area VARCHAR(255), -- 'muscle_gain', 'strength', 'overall'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workout exercises
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  day INT, -- 1-7
  exercise_name VARCHAR(255) NOT NULL,
  sets INT,
  reps INT,
  weight_lbs INT,
  rest_seconds INT,
  notes TEXT
);

-- Diet tips
CREATE TABLE IF NOT EXISTS diet_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100), -- 'nutrition', 'meal_prep', 'recipes'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255),
  category VARCHAR(100),
  image_url VARCHAR(500),
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily facts
CREATE TABLE IF NOT EXISTS daily_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fact TEXT NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboard (aggregated view)
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank INT,
  total_xp INT,
  weight_gained DECIMAL(5, 2),
  current_level INT,
  streak INT,
  snapshot_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_weight_entries_user_date ON weight_entries(user_id, date DESC);
CREATE INDEX idx_calorie_logs_user_date ON calorie_logs(user_id, date DESC);
CREATE INDEX idx_user_stats_total_xp ON user_stats(total_xp DESC);
CREATE INDEX idx_leaderboard_xp ON leaderboard_snapshots(total_xp DESC);
