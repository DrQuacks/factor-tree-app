import { render, screen } from './test-utils';
import Dashboard from '../pages/dashboard';

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: () => ({
    data: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.jpg',
      },
    },
    status: 'authenticated',
  }),
}));

// Mock the database functions with more specific implementations
jest.mock('../lib/database', () => ({
  getUserStats: jest.fn().mockResolvedValue({
    total_games: 10,
    games_completed: 8,
    total_incorrect_moves: 15,
    current_streak: 3,
    longest_streak: 5,
  }),
  getRecentGames: jest.fn().mockResolvedValue([
    { number: 24, difficulty: 'EASY', completed: true, incorrect_moves: 0, created_at: '2023-01-01' },
    { number: 36, difficulty: 'MEDIUM', completed: true, incorrect_moves: 1, created_at: '2023-01-02' },
    { number: 48, difficulty: 'HARD', completed: false, incorrect_moves: 2, created_at: '2023-01-03' },
  ]),
  getDifficultyStats: jest.fn().mockResolvedValue([
    { difficulty: 'EASY', completed: 5, avg_incorrect: 0.5 },
    { difficulty: 'MEDIUM', completed: 3, avg_incorrect: 1.2 },
    { difficulty: 'HARD', completed: 0, avg_incorrect: 0 },
  ]),
  getNumberHistory: jest.fn().mockResolvedValue([
    { number: 24, attempts: 2, incorrect_moves: 1, last_attempt: '2023-01-01' },
    { number: 36, attempts: 1, incorrect_moves: 0, last_attempt: '2023-01-02' },
  ]),
  upsertUserStats: jest.fn().mockResolvedValue(true),
  recordGame: jest.fn().mockResolvedValue(true),
}));

// Mock Next.js router to prevent navigation issues
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/dashboard',
    query: {},
  }),
}));

describe('Dashboard', () => {
  it('can be rendered without crashing', () => {
    // Just test that the component can be rendered without throwing an error
    expect(() => {
      render(<Dashboard />);
    }).not.toThrow();
  }, 15000); // Increase timeout to 15 seconds
}); 