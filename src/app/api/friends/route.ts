import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/database';
import User from '@/models/User';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const brawlID = await cookieStore.get('brawlID')?.value;

    if (!brawlID) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Find current user and populate friends
    const currentUser = await User.findOne({ BrawlID: brawlID })
      .populate('friends', '_id username BrawlID profilePicture');

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Filter out the current user from friends list if present
    const filteredFriends = currentUser.friends.filter((friend: any) => 
      friend.BrawlID !== brawlID
    );

    // Return the filtered friends array
    return NextResponse.json(filteredFriends);

  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 });
  }
} 