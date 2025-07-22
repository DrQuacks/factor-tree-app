import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import NavBar from '../components/Navbar';
import { DifficultyLevel } from '../lib/constants';
import { getUserStats, getRecentGames, getDifficultyStats, getNumberHistory, upsertUserStats } from '../lib/database';
import { UserStats, GameRecord, DifficultyStats } from '../lib/supabase';

// Helper function to get skiing difficulty indicators
const getDifficultyIndicator = (difficulty: string, completed: boolean, number?: number) => {
  if (!completed) {
    return <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">{number}</div>;
  }
  
  switch (difficulty) {
    case 'EASY':
      return <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">{number}</div>;
    case 'MEDIUM':
      return <div className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center text-xs font-bold text-white">{number}</div>;
    case 'HARD':
      return (
        <div className="w-7 h-7 bg-black rounded transform rotate-45 flex items-center justify-center text-xs font-bold text-white">
          <span className="transform -rotate-45 w-full flex items-center justify-center text-center">{number}</span>
        </div>
      );
    default:
      return <div className="w-7 h-7 bg-gray-500 rounded-full flex items-center justify-center text-xs font-bold text-white">{number}</div>;
  }
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentGames, setRecentGames] = useState<GameRecord[]>([]);
  const [difficultyStats, setDifficultyStats] = useState<DifficultyStats[]>([]);
  const [numberHistory, setNumberHistory] = useState<{[key: number]: GameRecord[]}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Load user data
    const loadUserData = async () => {
      if (!session.user?.email) return;
      
      try {
        setLoading(true);
        
        // First, ensure user stats are up to date
        await upsertUserStats(session.user.email);
        
        const [stats, games, diffStats] = await Promise.all([
          getUserStats(session.user.email),
          getRecentGames(session.user.email),
          getDifficultyStats(session.user.email)
        ]);
        
        setUserStats(stats);
        setRecentGames(games);
        setDifficultyStats(diffStats);
        
        // Load number history for all unique numbers played
        const uniqueNumbers = Array.from(new Set(games.map(game => game.number)));
        const historyData: {[key: number]: GameRecord[]} = {};
        
        for (const number of uniqueNumbers) {
          const history = await getNumberHistory(session.user.email, number);
          historyData[number] = history;
        }
        
        setNumberHistory(historyData);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FCF9F2' }}>
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

  if (!userStats) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FCF9F2' }}>
        <div className="text-lg">No data available</div>
      </div>
    );
  }

  const completionRate = userStats.total_games > 0 
    ? Math.round((userStats.games_completed / userStats.total_games) * 100)
    : 0;
  const averageIncorrectMoves = userStats.total_games > 0
    ? (userStats.total_incorrect_moves / userStats.total_games).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCF9F2' }}>
      <Head>
        <title>Dashboard - Prime Factor Trees</title>
      </Head>
      
      <NavBar
        onNewNumber={() => router.push('/')}
        onHint={() => router.push('/')}
        onFullyFactored={() => router.push('/')}
        onDifficultyChange={() => router.push('/')}
        currentDifficulty="MEDIUM"
        incorrectMoves={0}
        showGameControls={false}
        isOnDashboard={true}
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
                <p className="text-2xl font-bold text-gray-900">{userStats.games_completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">➗</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Incorrect Moves</p>
                <p className="text-2xl font-bold text-gray-900">{averageIncorrectMoves}</p>
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
                <p className="text-2xl font-bold text-gray-900">{userStats.current_streak}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🎖️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Longest Streak</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.longest_streak}</p>
              </div>
            </div>
          </div>
        </div>

         {/* Difficulty Breakdown */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           <div className="bg-white rounded-lg shadow-md p-6">
             <h2 className="text-xl font-semibold mb-4" style={{ color: '#4A6FA5' }}>Performance by Difficulty</h2>
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Incorrect</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {/* Sort by completed descending */}
                   {difficultyStats
                     .slice()
                     .sort((a, b) => b.completed - a.completed)
                     .map((stats) => (
                       <tr key={stats.difficulty}>
                         <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{stats.difficulty}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-gray-900">{stats.completed}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-gray-900">{stats.avg_incorrect || 0}</td>
                       </tr>
                     ))}
                 </tbody>
               </table>
             </div>
           </div>

           <div className="bg-white rounded-lg shadow-md p-6">
             <h2 className="text-xl font-semibold mb-4" style={{ color: '#4A6FA5' }}>Recent Games</h2>
             <div className="space-y-3">
               {recentGames.slice(0, 4).map((game, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getDifficultyIndicator(game.difficulty, game.completed, game.number)}
                    <div>
                      <p className="text-sm text-gray-600">{game.difficulty} • {new Date(game.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{game.incorrect_moves} incorrect</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Number History Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#4A6FA5' }}>Number History</h2>
          {Object.keys(numberHistory).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attempts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Best Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recent Attempts
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(numberHistory)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([number, attempts]) => {
                      const bestAttempt = attempts.reduce((best, current) => 
                        current.incorrect_moves < best.incorrect_moves ? current : best
                      );
                      return (
                        <tr key={number} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getDifficultyIndicator(bestAttempt.difficulty, true, Number(number))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{attempts.length}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{bestAttempt.incorrect_moves} incorrect</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {attempts.slice(0, 5).map((attempt, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col items-center bg-gray-50 rounded px-2 py-1 min-w-[70px]"
                                  title={`${attempt.incorrect_moves} incorrect moves - ${new Date(attempt.created_at).toLocaleDateString()}`}
                                >
                                  <span className="text-xs font-medium text-gray-700">
                                    {new Date(attempt.created_at).toLocaleDateString()}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {attempt.incorrect_moves} incorrect
                                  </span>
                                </div>
                              ))}
                              {attempts.length > 5 && (
                                <div className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  +{attempts.length - 5}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No number history available yet. Start playing to see your progress!</p>
          )}
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