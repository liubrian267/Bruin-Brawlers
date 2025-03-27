import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/database';
import User from '@/models/User';
import { cookies } from 'next/headers';

export async function GET() {
  //console.log('reached profile endpoint')
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const brawlID = cookieStore.get('brawlID')?.value;
    //console.log('brawlID:', brawlID);
    if (!brawlID) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await User.findOne({ BrawlID: brawlID });
    //console.log("user from profile endpoint",user)
    if (!user) {
      return NextResponse.json({ error: 'User was not found' }, { status: 404 });
    }
    // next response caches, so if there is an error fetching, it will return the previous response
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const brawlID = cookieStore.get('brawlID')?.value;

    if (!brawlID) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const user = await User.findOne({ BrawlID: brawlID });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user profile fields
    user.profilePicture = body.profilePicture || user.profilePicture;
    user.socialMedia = body.socialMedia || user.socialMedia;
    user.biography = body.biography || user.biography;

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: {
        profilePicture: user.profilePicture,
        socialMedia: user.socialMedia,
        biography: user.biography,
        username: user.BrawlID,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 