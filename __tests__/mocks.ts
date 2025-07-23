// Mock database functions
jest.mock('../lib/database', () => ({
  getUserStats: jest.fn().mockResolvedValue({
    total_games: 10,
    games_completed: 8,
    total_incorrect_moves: 15,
    current_streak: 3,
    longest_streak: 5,
  }),
  getRecentGames: jest.fn().mockResolvedValue([]),
  getDifficultyStats: jest.fn().mockResolvedValue([]),
  getNumberHistory: jest.fn().mockResolvedValue([]),
  upsertUserStats: jest.fn().mockResolvedValue(true),
  recordGame: jest.fn().mockResolvedValue(true),
}));

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Remove boolean attributes that cause warnings
    const { fill, ...restProps } = props;
    return React.createElement('img', restProps);
  },
})); 