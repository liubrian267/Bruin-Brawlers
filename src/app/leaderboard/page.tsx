"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trophy } from 'lucide-react';
import Link from 'next/link';

interface User {
  _id: string;
  username: string;
  BrawlID: string;
  profilePicture?: string;
  totalTrophies: number;
  brawlers: {
    name: string;
    trophies: number;
  }[];
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users/leaderboard');
        if (!response.ok) throw new Error('Failed to fetch leaderboard data');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-ucla-gold" />
            <span className="text-gray-700 dark:text-gray-300">Total Trophies</span>
          </div>
        </div>

        <div className="space-y-4">
          {users.map((user, index) => (
            <div
              key={user._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-ucla-blue dark:bg-blue-600 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {user.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt={user.username}
                          width={48}
                          height={48}
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-lg">
                            {user.username[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <Link
                          href={`/profile/${user.BrawlID}`}
                          className="text-lg font-semibold text-gray-900 dark:text-white hover:text-ucla-blue dark:hover:text-blue-400 transition-colors"
                        >
                          {user.username}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          BrawlID: {user.BrawlID}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-ucla-gold">
                        {user.totalTrophies.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Total Trophies
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {user.brawlers[0]?.name && (
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                            <Image
                              src={`/brawlers/${user.brawlers[0].name.toLowerCase().replace(/\s+/g, '-')}.png`}
                              alt={user.brawlers[0].name}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.brawlers[0]?.name || 'No Data'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.brawlers[0]?.trophies ? `${user.brawlers[0].trophies.toLocaleString()} trophies` : 'Top Brawler'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 