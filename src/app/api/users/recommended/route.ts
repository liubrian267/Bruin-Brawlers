import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import User from "@/models/User";
import { cookies } from "next/headers";
import { UserType } from "@/types/Users";

export async function GET() {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const brawlID = cookieStore.get("brawlID")?.value;

    if (!brawlID) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find current user and populate friends to get their friends list
    const currentUser = await User.findOne({ BrawlID: brawlID }).populate({
      path: "friends",
      populate: {
        path: "friends",
        select: "_id username BrawlID profilePicture",
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all friends of friends
    const friendsOfFriends = new Set();
    console.log(currentUser.friends, "recommend route");
    const populatedFriends = currentUser.friends as unknown as UserType[];

    populatedFriends.forEach((friend: UserType) => {
      if (friend.friends) {
        friend.friends.forEach((friendOfFriend: UserType) => {
          if (
            friendOfFriend.BrawlID !== brawlID &&
            !populatedFriends.some(
              (f: UserType) => f.BrawlID === friendOfFriend.BrawlID
            )
          ) {
            friendsOfFriends.add(friendOfFriend);
          }
        });
      }
    });

    let recommendedUsers = Array.from(friendsOfFriends) as UserType[];

    // If we have less than 5 friends of friends, add random users
    if (recommendedUsers.length < 5) {
      const existingIds = new Set([
        currentUser._id.toString(),
        ...populatedFriends.map((f: UserType) => f._id.toString()),
        ...recommendedUsers.map((u: UserType) => u._id.toString()),
      ]);
    
      const randomUsers = await User.find({
        _id: { $nin: Array.from(existingIds) }
      })
        .select('_id username BrawlID profilePicture socialMedia')
        .limit(5 - recommendedUsers.length);
    
      // Sanitize randomUsers by converting null socialMedia to undefined
      const sanitizedRandomUsers = randomUsers.map((userDoc) => {
        const user = userDoc.toObject() as unknown as UserType;
        return {
          ...user,
          socialMedia: user.socialMedia === null ? undefined : user.socialMedia,
        };
      });
      
    
      recommendedUsers = [...recommendedUsers, ...sanitizedRandomUsers];
    }
    

    // Limit to 5 recommendations and shuffle the array
    recommendedUsers = recommendedUsers
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    return NextResponse.json(recommendedUsers);
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
