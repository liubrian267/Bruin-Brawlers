import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/database';
import User from '@/models/User';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const brawlID = cookieStore.get('brawlID')?.value;

    if (!brawlID) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Find current user and populate friends to get their friends list
    const currentUser = await User.findOne({ BrawlID: brawlID })
      .populate({
        path: 'friends',
        populate: {
          path: 'friends',
          select: '_id username BrawlID profilePicture'
        }
      });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all friends of friends
    const friendsOfFriends = new Set();
    currentUser.friends.forEach((friend: any) => {
      if (friend.friends) {
        friend.friends.forEach((friendOfFriend: any) => {
          // Only add if it's not the current user and not already a direct friend
          if (friendOfFriend.BrawlID !== brawlID && 
              !currentUser.friends.some((f: any) => f.BrawlID === friendOfFriend.BrawlID)) {
            friendsOfFriends.add(friendOfFriend);
          }
        });
      }
    });

    let recommendedUsers = Array.from(friendsOfFriends);

    // If we have less than 5 friends of friends, add random users
    if (recommendedUsers.length < 5) {
      const existingIds = new Set([
        currentUser._id.toString(),
        ...currentUser.friends.map((f: any) => f._id.toString()),
        ...recommendedUsers.map((u: any) => u._id.toString())
      ]);

      const randomUsers = await User.find({
        _id: { $nin: Array.from(existingIds) }
      })
      .select('_id username BrawlID profilePicture')
      .limit(5 - recommendedUsers.length);

      recommendedUsers = [...recommendedUsers, ...randomUsers];
    }

    // Limit to 5 recommendations and shuffle the array
    recommendedUsers = recommendedUsers
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    return NextResponse.json(recommendedUsers);

  } catch (error) {
    console.error('Error fetching recommended users:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
} 