import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/database';
import User from '@/models/User';
import { Brawler, UserGameProfile } from '@/types/gameData';

async function fetchPlayerFromAPI(player_id: string) {
  const response = await fetch(
    `https://api.brawlstars.com/v1/players/%23${player_id}/`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BS_API_KEY}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
}

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all users
    const users = await User.find({}, 'BrawlID username profilePicture');
    
    // Fetch latest trophy data for each user
    const usersWithTrophies = await Promise.all(
      users.map(async (user) => {
        try {
          // Fetch latest data from Brawl Stars API
          const playerData = await fetchPlayerFromAPI(user.BrawlID);
          
          // Update user's trophy data in database
          user.trophies = playerData.trophies;
          user.brawlers = playerData.brawlers
            .sort((a : UserGameProfile, b : UserGameProfile) => b.trophies - a.trophies)
            .slice(0, 3)
            .map((brawler: Brawler) => ({
              name: brawler.name,
              trophies: brawler.trophies
            }));
          
          await user.save();

          return {
            _id: user._id,
            username: user.username || 'Anonymous',
            BrawlID: user.BrawlID,
            profilePicture: user.profilePicture,
            totalTrophies: playerData.trophies,
            brawlers: user.brawlers
          };
        } catch (error) {
          console.error(`Error fetching data for user ${user.BrawlID}:`, error);
          return {
            _id: user._id,
            username: user.username || 'Anonymous',
            BrawlID: user.BrawlID,
            profilePicture: user.profilePicture,
            totalTrophies: 0,
            brawlers: [{ name: 'No Data', trophies: 0 }]
          };
        }
      })
    );

    // Sort users by total trophies
    const sortedUsers = usersWithTrophies.sort((a, b) => b.totalTrophies - a.totalTrophies);

    return NextResponse.json(sortedUsers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
} 