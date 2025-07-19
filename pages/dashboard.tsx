import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import NavBar from '../components/Navbar';
import { DifficultyLevel } from '../lib/constants';

// Mock data - in a real app, this would come from a database
const mockUserStats = {
  totalGames: 47,
  gamesCompleted: 42,
  averageIncorrectMoves: 2.3,
  bestScore: 0, // 0 incorrect moves
  currentStreak: 5,
  longestStreak: 12,
  difficultyBreakdown: {
    EASY: { played: 15, completed: 15, avgIncorrect: 1.2 },
    MEDIUM: { played: 20, completed: 18, avgIncorrect: 2.8 },
    HARD: { played: 12, completed: 9, avgIncorrect: 4.1 }
  },
  recentGames: [
    { number: 84, difficulty: 'MEDIUM', incorrectMoves: 2, completed: true, date: '2024-07-19' },
    { number: 120, difficulty: 'HARD', incorrectMoves: 5, completed: false, date: '2024-07-18' },
    { number: 56, difficulty: 'EASY', incorrectMoves: 1, completed: true, date: '2024-07-17' },
    { number: 96, difficulty: 'MEDIUM', incorrectMoves: 3, completed: true, date: '2024-07-16' },
    { number: 72, difficulty: 'EASY', incorrectMoves: 0, completed: true, date: '2024-07-15' }
  ]
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStats, setUserStats] = useState(mockUserStats);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FCF9F2' }}>
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

  const completionRate = Math.round((userStats.gamesCompleted / userStats.totalGames) * 100);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCF9F2' }}>
      <Head>
        <title>Dashboard - Prime Factor Trees</title>
      </Head>
      
      <NavBar
        onNewNumber={() => router.push('/')}
        onHint={() => router.push('/')}
        onSolution={() => router.push('/')}
        onFullyFactored={() => router.push('/')}
        onDifficultyChange={() => router.push('/')}
        currentDifficulty="MEDIUM"
        incorrectMoves={0}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-wider mb-2" style={{ color: '#4A6FA5', fontFamily: 'Georgia, serif' }}>
            Your Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {session.user?.name}!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Games Completed</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.gamesCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.currentStreak}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🎖️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Incorrect</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.averageIncorrectMoves}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#4A6FA5' }}>Performance by Difficulty</h2>
            <div className="space-y-4">
              {Object.entries(userStats.difficultyBreakdown).map(([difficulty, stats]) => (
                <div key={difficulty} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{difficulty}</p>
                    <p className="text-sm text-gray-600">{stats.completed}/{stats.played} completed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{stats.avgIncorrect.toFixed(1)} avg incorrect</p>
                    <p className="text-sm text-gray-600">
                      {Math.round((stats.completed / stats.played) * 100)}% success
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#4A6FA5' }}>Recent Games</h2>
            <div className="space-y-3">
              {userStats.recentGames.map((game, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${game.completed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">Number {game.number}</p>
                      <p className="text-sm text-gray-600">{game.difficulty} • {game.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{game.incorrectMoves} incorrect</p>
                    <p className="text-sm text-gray-600">{game.completed ? 'Completed' : 'Incomplete'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#4A6FA5' }}>Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Play New Game
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Continue Last Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 